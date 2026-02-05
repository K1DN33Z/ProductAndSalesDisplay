import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import { fetchSalesForAllProducts, fetchProducts } from '../../api/productApi';

export function SalesPage() {
    const [sales, setSales] = useState([]);
    const [filteredSales, setFilteredSales] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Filter states
    const [selectedProduct, setSelectedProduct] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    
    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 50;
    
    let navigate = useNavigate();

    const fetchSales = async () => {
        setLoading(true);
        setError(null);
        
        const [salesResult, productsResult] = await Promise.all([
            fetchSalesForAllProducts(),
            fetchProducts()
        ]);
        
        if (salesResult.success && productsResult.success) {
            setSales(salesResult.data);
            setFilteredSales(salesResult.data);
            setProducts(productsResult.data);
        } else {
            setError(salesResult.error || productsResult.error);
        }
        
        setLoading(false);
    };

    useEffect(() => {
        fetchSales();
    }, []);

    // Apply filters whenever filter values change
    useEffect(() => {
        let filtered = [...sales];
        
        // Filter by product
        if (selectedProduct) {
            filtered = filtered.filter(sale => sale.productId === parseInt(selectedProduct));
        }
        
        // Filter by date range
        if (startDate) {
            filtered = filtered.filter(sale => new Date(sale.saleDate) >= new Date(startDate));
        }
        
        if (endDate) {
            filtered = filtered.filter(sale => new Date(sale.saleDate) <= new Date(endDate));
        }
        
        setFilteredSales(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    }, [selectedProduct, startDate, endDate, sales]);

    // Pagination calculations
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredSales.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredSales.length / recordsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const clearFilters = () => {
        setSelectedProduct('');
        setStartDate('');
        setEndDate('');
    };

    const navigateBack = () => {
        navigate("/");
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="columns-2">
                <div className="justify-self-start font-sans text-5xl font-bold p-5">Product Sales</div>
                <div className="justify-self-end">
                    <button className="btn btn-accent btn-wide m-5 w-40" onClick={fetchSales}>Refresh</button>
                    <button className="btn btn-outline btn-wide m-5 w-40" onClick={navigateBack}>Go Back</button>
                </div>
            </div>

            {/* Filters Section */}
            <div className="p-5 bg-base-200 rounded-lg mx-5 mb-5">
                <h3 className="text-lg font-semibold mb-3">Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Product</span>
                        </label>
                        <select 
                            className="select select-bordered w-full"
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                        >
                            <option value="">All Products</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.description}
                                </option>
                            ))}
                        </select>
                    </div>
                    
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Start Date</span>
                        </label>
                        <input 
                            type="date" 
                            className="input input-bordered w-full"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">End Date</span>
                        </label>
                        <input 
                            type="date" 
                            className="input input-bordered w-full"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">&nbsp;</span>
                        </label>
                        <button 
                            className="btn btn-outline"
                            onClick={clearFilters}
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
                
                <div className="mt-3 text-sm">
                    Showing {currentRecords.length} of {filteredSales.length} records
                </div>
            </div>

            <div className="overflow-x-auto p-5">
                <table className="table table-zebra w-full">
                    <thead>
                        <tr>
                            <th>Sale ID</th>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Sale Price</th>
                            <th>Quantity</th>
                            <th>Sale Total</th>
                            <th>Sale Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRecords.map((sale) => (
                            <tr key={sale.saleId}>
                                <td>{sale.saleId}</td>
                                <td>{sale.description}</td>
                                <td>{sale.category}</td>
                                <td>${sale.salePrice?.toFixed(2)}</td>
                                <td>{sale.saleQty}</td>
                                <td>${sale.saleTotal?.toFixed(2)}</td>
                                <td>{new Date(sale.saleDate).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center p-5">
                    <div className="join">
                        <button 
                            className="join-item btn"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            «
                        </button>
                        
                        {[...Array(totalPages)].map((_, index) => {
                            const pageNumber = index + 1;
                            // Show first page, last page, current page, and pages around current
                            if (
                                pageNumber === 1 ||
                                pageNumber === totalPages ||
                                (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2)
                            ) {
                                return (
                                    <button
                                        key={pageNumber}
                                        className={`join-item btn ${currentPage === pageNumber ? 'btn-active' : ''}`}
                                        onClick={() => handlePageChange(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            } else if (
                                pageNumber === currentPage - 3 ||
                                pageNumber === currentPage + 3
                            ) {
                                return <button key={pageNumber} className="join-item btn btn-disabled">...</button>;
                            }
                            return null;
                        })}
                        
                        <button 
                            className="join-item btn"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            »
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";
import { fetchProducts, fetchProductSales } from '../../api/productApi';
import { ProductCard } from '../../components/ProductCard';
import { ProductSummary } from '../../components/ProductSummary';

export function ProductPage() {
    // Helper variables
    const emptyProduct = {
        description: "",
        saleTotal: 0,
        quantityTotal: 0,
    };
    
    // Context setting
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(emptyProduct);

    // Package variables
    const navigate = useNavigate();

    // useEffects
    useEffect(() => {
        loadProducts();
    }, []);

    // API calls
    const loadProducts = async () => {
        setLoading(true);
        const result = await fetchProducts();
        
        if (result.success) {
            setProducts(result.data);
            setError(null);
        } else {
            setError(result.error);
        }
        
        setLoading(false);
    };

    const handleSalesSummary = async (product) => {
        setSummaryLoading(true);
        
        // Fetch sales data for the selected product
        const salesResult = await fetchProductSales(product.id);
        
        if (salesResult.success) {
            // Update selected product with sales totals
            setSelectedProduct({
                ...product,
                saleTotal: salesResult.data.saleTotal,
                quantityTotal: salesResult.data.quantityTotal
            });
        } else {
            // If fetch failed, just set the product without totals
            setSelectedProduct({
                ...product,
                saleTotal: 0,
                quantityTotal: 0
            });
            setError(salesResult.error);
        }
        
        setSummaryLoading(false);
    };

    // Handlers
    const handleRefresh = () => {
        loadProducts();
        setSelectedProduct(emptyProduct);
    };

    const navigateToSales = () => {
        navigate("/sales");
    };


    // Loading screen during data fetch
    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    // Error screen
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
                <div className="justify-self-start font-sans text-5xl font-bold p-5">Products</div>
                <div className="justify-self-end">
                    <button className="btn btn-wide btn-accent m-5 w-40" onClick={handleRefresh}>Refresh</button>
                    <button className="btn btn-wide btn-primary m-5 w-40" onClick={navigateToSales}>View Product Sales</button>
                </div>
            </div>

            <div className="m-16">
                <div className="grid grid-cols-4 gap-4 auto-rows-auto">
                    {products.map(product => (
                        <ProductCard 
                            key={product.id}
                            product={product}
                            onClick={handleSalesSummary}
                        />
                    ))}
              
                    <ProductSummary 
                        product={selectedProduct}
                        isLoading={summaryLoading}
                    />
                </div>
            </div>
        </>
    );
}
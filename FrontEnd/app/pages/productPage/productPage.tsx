import { useState, useEffect } from 'react';
import { useNavigate } from "react-router";

export function ProductPage() {
    const emptyProduct = {
        description: "",
        salesPrice: 0
    };
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(emptyProduct)
    let navigate = useNavigate();

    useEffect(() => {
    fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:5250/api/product/products');
            const result = await response.json();
      
            if (result.message === 'Success') {
                setProducts(result.data);
                console.log(result.data);
            } else {
            setError('Failed to fetch products');
            }
        } catch (err) {
            setError('Error fetching products: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSalesSummary = (product: any) => {
        setSelectedProduct(product);
    };

    const handleRefresh = () => {
      fetchProducts();
      setSelectedProduct(emptyProduct);
    };

    const navigateToSales = () => {
        navigate("/sales");
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
            <div className="justify-self-start font-sans text-5xl font-bold p-5">Products</div>
            <div className="justify-self-end">
                <button className="btn btn-wide btn-accent m-5 w-40" onClick={handleRefresh}>Refresh</button>
                <button className="btn btn-wide btn-primary m-5 w-40" onClick={navigateToSales}>View Product Sales</button>
            </div>
        </div>

        <div className="m-16">
            <div className="grid grid-cols-4 gap-4 auto-rows-auto">
              {products.map(product => (
                <div 
                  key={product.id}
                  className="card bg-base-100 shadow-sm" 
                  onClick={() => handleSalesSummary(product)}
                >
                    <figure className="w-full h-[200px] overflow-hidden">
                        <img className="w-full h-full object-cover"
                            src={product.image}
                            alt={product.description} />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">
                            {product.description}
                            <div
                                className={`badge ${product.category === 'Fruit'
                                        ? 'badge-primary'
                                        : 'badge-accent'
                                    }`}
                            >
                                {product.category}
                            </div>
                        </h2>
                        <p>Sales Price: {product.salesPrice}</p>
                    </div>
                </div>
              ))}
              
              <div className="col-start-4 row-start-1 row-span-2 bg-base-200 p-4 m-4 rounded-lg" id="summary">
                  <div className="justify-self-start font-sans text-xl font-bold">Summary</div>
                  {selectedProduct.description !== "" ? 
                      <div>
                        Product: {selectedProduct.description}
                        <br></br>
                        Price: {selectedProduct.salesPrice}
                        <br></br>
                        Sold: 999
                      </div>
                      
                  :
                      <div>Please select a product to view</div>
                  }
                  
              </div>
          </div>
        </div>
    </>
    );
}
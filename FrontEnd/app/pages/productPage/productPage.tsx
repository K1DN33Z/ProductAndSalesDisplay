import { useState, useEffect } from 'react';

export function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          <div className="justify-self-center font-sans text-5xl font-bold p-5">Products</div>
          <div className="m-16">
              <div className="grid grid-cols-4 gap-4">
                  <div className="card bg-base-100 w-100 shadow-sm">
                      Yo
                  </div>
              </div>
          </div>
      </>
  );
}
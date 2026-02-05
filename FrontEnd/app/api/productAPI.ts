const API_BASE_URL = 'http://localhost:5250/api';

/**
 * Fetches all products from the API
 * @returns {Promise<{success: boolean, data: Array|null, error: string|null}>}
 */
export const fetchProducts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/product/products`);
        const result = await response.json();
      
        if (result.message === 'Success') {
            return { success: true, data: result.data, error: null };
        } else {
            return { success: false, data: null, error: 'Failed to fetch products' };
        }
    } catch (err) {
        return { success: false, data: null, error: 'Error fetching products: ' + err.message };
    }
};

/**
 * Fetches sales data for a specific product and calculates totals
 * @param {number} id - Product ID
 * @returns {Promise<{success: boolean, data: {saleTotal: number, quantityTotal: number}|null, error: string|null}>}
 */
export const fetchProductSales = async (id) => {
    try {
        const response = await fetch(`${API_BASE_URL}/productsale/product-sales?id=${id}`);
        const result = await response.json();
      
        if (result.message === 'Success') {
            // Calculate totals from the sales data
            const saleTotal = result.data.reduce((sum, sale) => sum + (sale.salePrice * sale.saleQty), 0);
            const quantityTotal = result.data.reduce((sum, sale) => sum + sale.saleQty, 0);
            
            return { success: true, data: { saleTotal, quantityTotal }, error: null };
        } else {
            return { success: false, data: null, error: 'Failed to fetch product sales' };
        }
    } catch (err) {
        return { success: false, data: null, error: 'Error fetching product sales: ' + err.message };
    }
};

export const fetchSalesForAllProducts = async () => {
    try {
        const allSales = [];
        
        // Fetch all products
        const productsResult = await fetchProducts();
        
        if (!productsResult.success) {
            return { success: false, data: null, error: productsResult.error };
        }
        
        const products = productsResult.data;
        
        // Fetch raw sales data for each product
        const salesPromises = products.map(async (product) => {
            const response = await fetch(`${API_BASE_URL}/productsale/product-sales?id=${product.id}`);
            const result = await response.json();
            return { product, salesData: result };
        });
        
        const results = await Promise.all(salesPromises);
        
        // Flatten all sales with product info
        results.forEach(({ product, salesData }) => {
            if (salesData.message === 'Success' && salesData.data) {
                salesData.data.forEach(sale => {
                    allSales.push({
                        saleId: sale.saleId,
                        productId: product.id,
                        description: product.description,
                        category: product.category,
                        salePrice: sale.salePrice,
                        saleQty: sale.saleQty,
                        saleDate: sale.saleDate,
                        saleTotal: sale.salePrice * sale.saleQty
                    });
                });
            }
        });

        return { success: true, data: allSales, error: null };
    } catch (err) {
        return { success: false, data: null, error: 'Error fetching sales: ' + err.message };
    }
};
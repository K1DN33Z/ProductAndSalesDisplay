export function ProductSummary({ product, isLoading }) {
    const hasProduct = product.description !== "";

    if (isLoading) {
        return (
            <div className="col-start-4 row-start-1 row-span-2 bg-base-200 p-4 m-4 rounded-lg" id="summary">
                <div className="justify-self-start font-sans text-xl font-bold">Summary</div>
                <div className="flex justify-center items-center">
                    <span className="loading loading-spinner loading-m"></span>
                </div>
            </div>
        );
    }

    return (
        <div className="col-start-4 row-start-1 row-span-2 bg-base-200 p-4 m-4 rounded-lg" id="summary">
            <div className="justify-self-start font-sans text-xl font-bold">Summary</div>
            {hasProduct ? (
                <div>
                    <p className="font-sans text-l font-bold p-3">Product:</p> 
                    <p className="font-sans text-m px-3">{product.description}</p> 
                    <p className="font-sans text-l font-bold p-3">Total Quantity Sold:</p> 
                    <p className="font-sans text-m px-3">{product.quantityTotal} <u>units</u> sold</p> 
                    <p className="font-sans text-l font-bold p-3">Total Sales Revenue:</p> 
                    <p className="font-sans text-m px-3">R {product.saleTotal.toFixed(2)}</p> 
                </div>
            ) : (
                <div>Please select a product to view</div>
            )}
        </div>
    );
}
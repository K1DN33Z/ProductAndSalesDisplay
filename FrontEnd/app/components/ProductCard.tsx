export function ProductCard({ product, onClick }) {
    return (
        <div 
            className="card bg-base-100 shadow-sm cursor-pointer hover:shadow-lg transition-shadow" 
            onClick={() => onClick(product)}
        >
            <figure className="w-full h-[200px] overflow-hidden">
                <img 
                    className="w-full h-full object-cover"
                    src={product.image}
                    alt={product.description} 
                />
            </figure>
            <div className="card-body">
                <h2 className="card-title">
                    {product.description}
                    <div
                        className={`badge ${
                            product.category === 'Fruit'
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
    );
}
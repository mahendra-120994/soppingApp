import './index.css'

const SimilarProductItem = props => {
  const {productDetails} = props
  const {imageUrl, title, brand, price, rating} = productDetails
  return (
    <li className="similar-product-item">
      <img
        src={imageUrl}
        alt="similar product"
        className="similar-product-image"
      />
      <div className="similar-product-details">
        <h1 className="similar-product-title">{title}</h1>
        <p className="similar-product-brand">by {brand}</p>
        <div className="price-rating">
          <p className="similar-product-price">Rs {price}/-</p>
          <div className="similar-product-rating-container">
            <p className="similar-product-rating">{rating}</p>
            <img
              src="https://assets.ccbp.in/frontend/react-js/star-img.png"
              className="similar-product-star"
              alt="star"
            />
          </div>
        </div>
      </div>
    </li>
  )
}
export default SimilarProductItem

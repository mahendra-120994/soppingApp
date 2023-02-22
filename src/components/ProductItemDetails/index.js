import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class ProductItemDetails extends Component {
  state = {
    productItem: {},
    SimilarProductList: [],
    apiStatus: apiStatusConstants.initial,
    quantity: 1,
  }

  componentDidMount() {
    this.getProductDetails()
  }

  formateProductDetails = data => {
    const productData = {
      id: data.id,
      brand: data.brand,
      availability: data.availability,
      description: data.description,
      price: data.price,
      rating: data.rating,
      style: data.style,
      title: data.title,
      imageUrl: data.image_url,
      reviews: data.total_reviews,
    }

    return productData
  }

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const jwtToken = Cookies.get('jwt_token')
    const url = `https://apis.ccbp.in/products/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(url, options)
    if (response.ok === true) {
      const data = await response.json()
      const productData = this.formateProductDetails(data)
      const SimilarProductList = data.similar_products.map(eachProduct =>
        this.formateProductDetails(eachProduct),
      )
      this.setState({
        productItem: productData,
        SimilarProductList,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  increaseQuantity = () => {
    this.setState(prev => ({quantity: prev.quantity + 1}))
  }

  decreaseQuantity = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState(prev => ({quantity: prev.quantity - 1}))
    }
  }

  continueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderProductItemView = () => {
    const {productItem, SimilarProductList, quantity} = this.state
    const {
      brand,
      availability,
      description,
      price,
      rating,
      title,
      reviews,
      imageUrl,
    } = productItem
    return (
      <>
        <div className="product-details-container">
          <img src={imageUrl} alt="product" className="product-img" />
          <div className="product-details-card">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="rating-review">
              <div className="rating-container">
                <p className="rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  className="star"
                  alt="star"
                />
              </div>
              <p className="product-review">{reviews} Reviews</p>
            </div>
            <p className="product-description">{description}</p>

            <p className="product-availability">
              <span className="available">Available: </span>
              {availability}
            </p>
            <p className="product-brand">
              <span className="brand">Brand: </span>
              {brand}
            </p>
            <hr className="ruler" />
            <div className="add-product">
              <button
                type="button"
                data-testid="minus"
                className="change-quantity"
                onClick={this.decreaseQuantity}
              >
                <BsDashSquare />
              </button>

              <p className="quantity">{quantity}</p>
              <button
                type="button"
                data-testid="plus"
                className="change-quantity"
                onClick={this.increaseQuantity}
              >
                <BsPlusSquare />
              </button>
            </div>
            <button type="button" className="add-to-cart-btn">
              ADD TO CART
            </button>
          </div>
        </div>
        <div className="similar-product-container">
          <h1 className="similar-product-heading">Similar Products</h1>
          <ul className="similar-product-list">
            {SimilarProductList.map(productDetails => (
              <SimilarProductItem
                key={productDetails.id}
                productDetails={productDetails}
              />
            ))}
          </ul>
        </div>
      </>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="products-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">Product Not Found</h1>
      <button
        type="button"
        className="products-failure-btn"
        onClick={this.continueShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  render() {
    const {apiStatus} = this.state

    let renderView

    switch (apiStatus) {
      case apiStatusConstants.success:
        renderView = this.renderProductItemView()
        break
      case apiStatusConstants.inProgress:
        renderView = this.renderLoadingView()
        break
      case apiStatusConstants.failure:
        renderView = this.renderFailureView()
        break
      default:
        return null
    }

    return (
      <>
        <Header />
        <div className="product-item-container">{renderView}</div>
      </>
    )
  }
}
export default ProductItemDetails

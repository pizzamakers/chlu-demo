import React, { Component } from 'react'
import { shape, bool, any, object, func, number } from 'prop-types'
import { Link } from 'react-router'
// redux
import { connect } from 'react-redux'
import { compose } from 'redux'
import { submitEditReview } from 'store/modules/data/reviews'
import { setRatingRecentTransaction } from 'store/modules/components/RecentTransaction'
import { IsShowEditForm } from 'store/modules/ui/RecentTransaction'
// helpers
import get from 'lodash/get'
import { formatCurrency } from 'helpers/currencyFormat'
// hoc
import withCustomerTransactions from '../../../Hoc/withCustomerTransactions'
import withFxRates from '../../../Hoc/withFxRates'
// components
import EditReviewForm from './EditReviewForm'
import RaisedButton from 'material-ui/RaisedButton'
import TransactionInfo from './TransactionInfo'
// libs
import { toastr } from 'react-redux-toastr'
// styles
import './style.css'
import styles from 'styles/inlineStyles/containers/Customer/customerWallet'
// constants
const { submitBtnStyle } = styles

class RecentTransaction extends Component {
  static propTypes = {
    customerTransactions: shape({
      loading: bool,
      error: any,
      data: object
    }),
    reviews: shape({
      loading: bool,
      error: any,
      data: object
    }),
    editRating: number,
    isEditFormOpen: bool,
    submitEditReview: func,
    setRating: func,
    IsShowEditForm: func,
    calculateTotalSpent: func,
    groupTransactionByAddress: func,
    convertSatoshiToBTC: func,
    convertFromBtcToUsd: func,
    convertFromBtcToBits: func,
    convertFromBitsToUsd: func,
    convertSatoshiToBits: func,
    convertFromUsdToBtc: func
  }

  componentDidMount() {
    const { isEditFormOpen } = this.props
    isEditFormOpen && this.hideEditForm()
  }

  handleEditFormSubmit = (comment) => {
    const {
      routeParams: { address },
      submitEditReview,
      editRating: rating
    } = this.props

    submitEditReview({ address, comment: { ...comment, rating, date: '2017-09-22T06:17:32Z' } })
      .then((response) => {
        console.log(response)
        toastr.success('success', 'Edit success')
        this.hideEditForm()
      })
  }

  onStarClick = rating => this.props.setRating(rating)

  showEditForm = () => this.props.IsShowEditForm(true)

  hideEditForm = () => {
    const { IsShowEditForm, editRating } = this.props

    IsShowEditForm(false)

    if (editRating !== 0){
      this.onStarClick(0)
    }
  }

  render() {
    const {
      routeParams,
      editRating,
      isEditFormOpen,
      customerTransactions,
      calculateTotalSpent,
      reviews: { reviews },
      convertSatoshiToBTC,
      convertFromBtcToBits,
      convertFromBitsToUsd,
      convertFromBtcToUsd,
      convertSatoshiToBits
    } = this.props

    const address = get(routeParams,'address', '')

    const transaction = get(customerTransactions, 'data.txs', [])
      .filter(({ addresses }) => addresses[addresses.length - 1] === address)
    const totalBTC = convertSatoshiToBTC(calculateTotalSpent(transaction))
    const totalBits = convertFromBtcToBits(totalBTC, 8)
    const totalUSD = convertFromBtcToUsd(totalBTC)
    const totalBitsFormatted = formatCurrency(totalBits)
    const totalUSDFormatted = formatCurrency(totalUSD)

    return (
      <div className='page-container color-main'>
        {transaction.length
          ? <div className='recent-transaction'>
            <div className='section-head container'>
              <div className='title font-weight-bold'>Recent Transaction</div>
              <Link to='#' className='address'>{address}</Link>
              <div className='price'>
                <div className='price-title font-weight-bold'>Spent</div>
                <div className='price-spent'>
                  <div className='price-spent__item font-weight-bold'>{totalBitsFormatted} bits</div>
                  <div className='price-spent__item font-smaller'>{totalUSDFormatted} USD</div>
                </div>
              </div>
            </div>
            <div className='section-content'>
              <div className='container'>
                <div className='transaction-info__wrapper'>
                  {transaction.map((item, index) => (
                    <TransactionInfo
                      key={index}
                      address={address}
                      transaction={item}
                      convertSatoshiToBits={convertSatoshiToBits}
                      convertSatoshiToBTC={convertSatoshiToBTC}
                      convertFromBtcToUsd={convertFromBtcToUsd}
                      convertFromBitsToUsd={convertFromBitsToUsd}
                      review={reviews[item.hash]}
                    />
                  ))}
                </div>
                <div className='edit-review'>
                  {isEditFormOpen
                    ? <EditReviewForm
                      onSubmit={this.handleEditFormSubmit}
                      handleCancel={this.hideEditForm}
                      onStarClick={this.onStarClick}
                      rating={editRating}
                    />
                    : <RaisedButton
                      {...submitBtnStyle}
                      label='Edit'
                      onClick={this.showEditForm}
                    />
                  }
                </div>
              </div>
            </div>
          </div>
          : <div className='container'>
            There are no transactions with this address <span className='font-weight-bold'>({address})</span>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = store => ({
  editRating: store.components.recentTransaction.rating,
  isEditFormOpen: store.ui.recentTransaction.isEditFormOpen,
  transactionHistory: store.data.transactionHistory,
  reviews: store.data.reviews
})

const mapDispatchToProps = {
  submitEditReview,
  setRating: setRatingRecentTransaction,
  IsShowEditForm
}

export default compose(
  withFxRates,
  withCustomerTransactions,
  connect(mapStateToProps, mapDispatchToProps)
)(RecentTransaction)

import React, { Component } from 'react'
import PropTypes from 'prop-types'
// redux
import { connect } from 'react-redux'
import { getTransactionHistory } from 'store/modules/data/transactionHistory'
// libs
import _ from 'lodash'
// components
import CircularProgress from 'material-ui/CircularProgress'
// assets
import data from './assets/data'

const { address } = data

const withTransactionHistory = (WrappedComponent) => {
  class AsyncTransactionHistory extends Component {
    static propTypes = {
      transactionHistory: PropTypes.object,
      getTransactionHistory: PropTypes.func.isRequired
    }

    componentDidMount () {
      this.props.getTransactionHistory(address)
    }

    groupTransactionByAddress = (transactions) => {
      const result = []
      const grouped = _.groupBy(transactions, ({ addresses }) => addresses[addresses.length - 1])

      for(const address in grouped){
        result.push({
          address,
          totalSpent: this.calculateTotalSpent(grouped[address]),
          transactions: grouped[address]
        })
      }

      return result
    }

    calculateTotalSpent = (transactions, field = 'total') => {
      let result = 0

      if(Array.isArray(transactions) && transactions.length){
        result = transactions.reduce((accumulator, transaction) => (
          accumulator + transaction[field]
        ), 0)
      }

      return result
    }

    render () {
      const { transactionHistory: { loading } } = this.props

      return (
        loading
        ? <CircularProgress />
        : <WrappedComponent
          groupTransactionByAddress={this.groupTransactionByAddress}
          calculateTotalSpent={this.calculateTotalSpent}
          address={address}
          {...this.props}
        />
      )
    }
  }

  const mapStateToProps = store => ({
    transactionHistory: store.data.transactionHistory
  })

  const mapDispatchToProps = {
    getTransactionHistory
  }

  return connect(mapStateToProps, mapDispatchToProps)(AsyncTransactionHistory)
}

export default withTransactionHistory
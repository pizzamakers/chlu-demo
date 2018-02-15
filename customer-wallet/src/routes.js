import React from 'react'
import { Route, IndexRedirect } from 'react-router'
// helpers
import replace from 'helpers/replace'
// redux
import { getProfile } from 'store/modules/data/profile'
// containers
import MainLayout from './containers/Layout/MainLayout'
import AppLayout from './containers/Layout/AppLayout'
import Wallet from './containers/Wallet'
import CreateWallet from './containers/Wallet/Create/index'
import ImportWallet from './containers/Wallet/Import/index'
import CustomerWallet from './containers/Customer/CustomerWallet'
import Settings from './containers/Customer/Settings'
import VendorWallet from './containers/Vendor/VendorWallet'
import Checkout from './containers/Customer/Checkout'
import Profile from './containers/Vendor/Profile'
import TransactionHistory from './containers/Customer/Transactions/TransactionHistory'
import RecentTransactions from './containers/Customer/Transactions/RecentTransactions'
import NotFound from './components/NotFound/'
import Demo from './containers/Demonstrator/Demo'
import WithChluIPFS from './containers/Hoc/WithChluIPFS'
import ChluIPFS from 'chlu-ipfs-support'

function getRoutes (store) {
  return (
    <Route path='/' component={MainLayout}>
      <IndexRedirect to='wallet' />
      <Route onEnter={(nextState, replace, proceed) => checkMnemonicExists(proceed)}>
        <Route exact path='wallet' component={Wallet} />
        <Route path='wallet/create' component={CreateWallet} />
        <Route path='wallet/import' components={ImportWallet} />
      </Route>
      <Route
        component={AppLayout}
        onEnter={(nextState, replace, proceed) => preloadUser(nextState, proceed, store)}
      >
        <Route path='customer'>
          <IndexRedirect to='wallet' />
          <Route path='checkout' component={Checkout}/>
          <Route
            path='wallet'
            component={WithChluIPFS(ChluIPFS.types.customer, CustomerWallet)}
            onEnter={(nextState, replace, proceed) => checkMissingMnemonic(proceed)}
          />
          <Route path='transactions' component={TransactionHistory} />
          <Route path='transactions/:address' component={RecentTransactions} />
          <Route path='settings' component={Settings} />
        </Route>
        <Route path='vendor'>
          <IndexRedirect to='wallet'/>
          <Route path='profile' component={WithChluIPFS(ChluIPFS.types.vendor, Profile)} />
          <Route path='wallet' component={WithChluIPFS(ChluIPFS.types.vendor, VendorWallet)} />
        </Route>
        <Route path='demonstrator' >
          <IndexRedirect to='demo' />
          <Route path='demo' component={Demo} />
        </Route>
      </Route>
      <Route path='*' component={NotFound} status={404} />
    </Route>
  )
}

function checkMnemonicExists(proceed) {
  if (localStorage.getItem('mnemonic_key')) {
    replace('/customer')
  }

  proceed()
}

function checkMissingMnemonic(proceed) {
  if (!localStorage.getItem('mnemonic_key')) {
    replace('/')
  }

  proceed()
}

async function preloadUser(nextState, proceed, { getState, dispatch }) {
  const { data } = getState().data.profile
  const [ , nextUserType, ...rest ] = nextState.location.pathname.split('/')

  if (!data) {
    try {
      const { userType } = await dispatch(getProfile(nextUserType))
      const nextPath = [ nextUserType || userType, ...rest ].join('/')
      replace(`/${nextPath}`)
    } catch (error) {
        console.log('error_____', error.message)
    }
  }
  
  proceed()
}

export default getRoutes

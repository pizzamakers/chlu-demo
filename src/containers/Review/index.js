import React, { Component } from 'react'
// components
import { withStyles, Card, CardHeader, CircularProgress, Avatar } from '@material-ui/core'
import Review from 'components/Review'
// Icons
import ErrorIcon from '@material-ui/icons/Error'
// Redux
import { connect } from 'react-redux'
import { compose } from 'recompose'
import { readReviewRecord } from 'store/modules/data/review'

const styles = theme => ({
  pageContent: {
    marginTop: '30px'
  }
});

class ReviewContainer extends Component {

  componentDidMount() {
    const multihash = this.props.match.params.multihash
    this.props.readReviewRecord(multihash)
  }

  render() {
    const { classes, multihash, review, match } = this.props
    const ok = multihash === match.params.multihash
    if (!review || !ok || review.loading) {
      return <Card className={classes.pageContent}>
        <CardHeader
          avatar={<CircularProgress/>}
          title='Fetching Review...'
        />
      </Card>
    } else if (review.error) {
      return <Card className={classes.pageContent}>
        <CardHeader
          avatar={<Avatar><ErrorIcon/></Avatar>}
          title='Something went wrong'
          subheader={review.error}
        />
      </Card>
    } else {
      return <div className={classes.pageContent}><Review review={review} detailed={true}/></div>
    }
  }
}

const mapStateToProps = state => ({
  multihash: state.data.review.multihash,
  review: state.data.review.data,
  editing: state.data.review.editing
})

const mapDispatchToProps = {
  readReviewRecord
}

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(ReviewContainer)
import React from 'react';

// components
import {
  withStyles,
  InputAdornment,
  Grid,
  Checkbox,
  Radio,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core'

import { Link } from 'react-router-dom'

// custom components
import CustomInput from 'components/MaterialDashboardPro/CustomInput';
import InfoArea from 'components/MaterialDashboardPro/InfoArea'
import PictureUpload from 'components/MaterialDashboardPro/PictureUpload'
import BusinessLocationField from './BusinessLocationField';

// icons
import Face from '@material-ui/icons/Face';
import Email from '@material-ui/icons/Email';
import DoneIcon from '@material-ui/icons/Done'
import Check from '@material-ui/icons/Check';
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";

// style
import customSelectStyle from 'styles/material-dashboard-pro-react/customSelectStyle.jsx';
import customCheckboxRadioSwitch from 'styles/material-dashboard-pro-react/customCheckboxRadioSwitch.jsx';

const style = {
  infoText: {
    fontWeight: '300',
    margin: '10px 0 30px',
    textAlign: 'center'
  },
  inputAdornmentIcon: {
    color: '#555'
  },
  choice: {
    textAlign: 'center',
    cursor: 'pointer',
    marginTop: '20px'
  },
  description: {
    textAlign: 'center'
  },
  ...customSelectStyle,
  ...customCheckboxRadioSwitch
};

class Step1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstname: "",
      firstnameState: "",
      lastname: "",
      lastnameState: "",
      email: "",
      emailState: "",
      simpleSelect: "",
      selectedValue: "user",
      businesstype: "0",
      businesslocation: ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleChangeEnabled = this.handleChangeEnabled.bind(this);
  }
  handleSimple = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleChange(event) {
    this.setState({ selectedValue: event.target.value });

    if (this.props.onSignupTypeChange) {
      this.props.onSignupTypeChange(event.target.value);
    }
  }
  handleChangeEnabled(event) {
    this.setState({ selectedEnabled: event.target.value });
  }
  handleToggle(value) {
    const { checked } = this.state;
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    this.setState({
      checked: newChecked
    });
  }



  toggleAcceptTerms() {
    this.props.setAcceptTermsAndConditions(!this.props.acceptedTerms)
  }

  // function that returns true if value is email, false otherwise
  verifyEmail(value) {
    var emailRex = /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(value)) {
      return true;
    }
    return false;
  }
  // function that verifies if a string has a given length or not
  verifyLength(value, length) {
    if (value.length >= length) {
      return true;
    }
    return false;
  }
  change(value, stateName, type, stateNameEqualTo) {
    switch (type) {
    case 'email':
      if (this.verifyEmail(value)) {
        this.setState({ [stateName + 'State']: 'success' });
      } else {
        this.setState({ [stateName + 'State']: 'error' });
      }
      break;
    case 'length':
      if (this.verifyLength(value, stateNameEqualTo)) {
        this.setState({ [stateName + 'State']: 'success' });
      } else {
        this.setState({ [stateName + 'State']: 'error' });
      }
      break;
    default:
      break;
    }
    this.setState({ [stateName]: value });
    this.props.onProfileFieldChange(stateName, value);
  }

  renderUser() {
    if (this.state.selectedValue !== "user") return undefined;

    const { classes } = this.props;

    return (
      <Grid container justify='center' spacing={16}>
        <Grid item xs={12} sm={12} md={12}>
          <PictureUpload />
          <div className={classes.description}>Upload Photo</div>
        </Grid>

        <Grid item xs={12} sm={12} md={5}>
          <CustomInput
            success={this.state.emailState === 'success'}
            error={this.state.emailState === 'error'}
            labelText={<span>Email <small>(required)</small></span>}
            id='email'
            formControlProps={{ fullWidth: true }}
            inputProps={{
              onChange: event => this.change(event.target.value, 'email', 'length', 3),
              endAdornment: (
                <InputAdornment position='end' className={classes.inputAdornment}>
                  <Email className={classes.inputAdornmentIcon} />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={5}>
          <CustomInput
            success={this.state.usernameState === 'success'}
            error={this.state.usernameState === 'error'}
            labelText={<span>User Name <small>(required)</small></span>}
            id='username'
            formControlProps={{ fullWidth: true }}
            inputProps={{
              onChange: event => this.change(event.target.value, 'username', 'length', 3),
              endAdornment: (
                <InputAdornment position='end' className={classes.inputAdornment}>
                  <Face className={classes.inputAdornmentIcon} />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={5}>
          <CustomInput
            success={this.state.firstnameState === 'success'}
            error={this.state.firstnameState === 'error'}
            labelText={<span>First Name <small>(optional)</small></span>}
            id='firstname'
            formControlProps={{ fullWidth: true }}
            inputProps={{
              onChange: event => this.change(event.target.value, 'firstname', 'length', 3),
              endAdornment: (
                <InputAdornment position='end' className={classes.inputAdornment}>
                  <Face className={classes.inputAdornmentIcon} />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={5}>
          <CustomInput
            success={this.state.lastnameState === 'success'}
            error={this.state.lastnameState === 'error'}
            labelText={<span>Last Name <small>(optional)</small></span>}
            id='lastname'
            formControlProps={{ fullWidth: true }}
            inputProps={{
              onChange: event => this.change(event.target.value, 'lastname', 'length', 3),
              endAdornment: (
                <InputAdornment position='end' className={classes.inputAdornment}>
                  <Face className={classes.inputAdornmentIcon} />
                </InputAdornment>
              )
            }}
          />
        </Grid>
      </Grid>
    )
  }

  renderBusiness() {
    if (this.state.selectedValue !== "business") return undefined;

    const { classes } = this.props;

    return (
      <Grid container justify='center' spacing={16}>
        <Grid item xs={12} sm={12} md={12}>
          <PictureUpload />
          <div className={classes.description}>Upload Company Logo</div>
        </Grid>

        <Grid item xs={12} sm={12} md={5}>
          <CustomInput
            success={this.state.businessnameState === 'success'}
            error={this.state.businessnameState === 'error'}
            labelText={<span>Business Name <small>(optional)</small></span>}
            id='businessname'
            formControlProps={{ fullWidth: true }}
            inputProps={{
              onChange: event => this.change(event.target.value, 'businessname', 'length', 3),
              endAdornment: (
                <InputAdornment position='end' className={classes.inputAdornment}>
                  <Face className={classes.inputAdornmentIcon} />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={5}>
          <FormControl fullWidth className={classes.selectFormControl}>
            <InputLabel htmlFor='simple-select' className={classes.selectLabel}>
              Business Type
            </InputLabel>

            <Select
              MenuProps={{ className: classes.selectMenu }}
              classes={{ select: classes.select }}
              value={this.state.businesstype}
              onChange={this.handleSimple}
              inputProps={{
                onChange: event => this.change(event.target.value, 'businesstype'),
                name: "simpleSelect",
                id: "simple-select"
              }}
            >
              <MenuItem value='0' disabled classes={{ root: classes.selectMenuItem }}>
                Select Industry
              </MenuItem>

              <MenuItem value='1' classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }}>
                Accountant
              </MenuItem>

              <MenuItem value='2' classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }}>
                Advertising
              </MenuItem>

              <MenuItem value='3' classes={{ root: classes.selectMenuItem, selected: classes.selectMenuItemSelected }}>
                Restaurant
              </MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={12} md={10}>
          <CustomInput
            labelText='A brief description of your business.'
            id='about-me'
            formControlProps={{ fullWidth: true }}
            inputProps={{ onChange: event => this.change(event.target.value, 'businessdescription') }}
          />
        </Grid>

        <Grid item xs={12} sm={12} md={10}>
          <BusinessLocationField
            value={this.state.businesslocation}
            onChange={value => this.change(value, 'businesslocation')}
            classes={classes}
          />
        </Grid>
      </Grid>
    )
  }

  render() {
    const { classes, wallet } = this.props;

    if (wallet && wallet.did) {
      return (
        <Grid container justify='center'>
          <Grid item xs={4}>
            <InfoArea
              icon={DoneIcon}
              iconColor='success'
              title='All done'
              description='Your wallet is ready to go'
            />
          </Grid>
        </Grid>
      )
    } else {
      return (
        <form action='/myreputation' className={classes.form} onSubmit={this.testSubmit}>
          <Grid container justify='center' spacing={16}>
            <Grid item xs={12} sm={12} md={5}>
              <FormControlLabel
                classes={{ label: classes.label }}
                label='Create A Consumer Account. Used to Pay, Review & Earn Chlu'
                control={
                  <Radio
                    id='userAccount'
                    checked={this.state.selectedValue === "user"}
                    onChange={this.handleChange}
                    value='user'
                    name='radio button demo'
                    aria-label='A'
                    icon={<FiberManualRecord className={classes.radioUnchecked} />}
                    checkedIcon={<FiberManualRecord className={classes.radioChecked} />}
                    classes={{ checked: classes.radio }}
                  />
                }
              />
            </Grid>

            <Grid item xs={12} sm={12} md={5}>
              <FormControlLabel
                classes={{ label: classes.label }}
                label='Create A Business Account. Control Your Online Reviews'
                control={
                  <Radio
                    checked={this.state.selectedValue === "business"}
                    onChange={this.handleChange}
                    value='business'
                    name='radio button demo'
                    aria-label='B'
                    icon={<FiberManualRecord className={classes.radioUnchecked} />}
                    checkedIcon={<FiberManualRecord className={classes.radioChecked} />}
                    classes={{ checked: classes.radio }}
                  />
                }
              />
            </Grid>

            {this.renderUser()}
            {this.renderBusiness()}

            <Grid item xs={12} sm={12} md={10}>
              <FormControlLabel
                classes={{ root: classes.checkboxLabelControl, label: classes.checkboxLabel }}
                label={<span>I agree to the <Link to='/terms'>terms and conditions</Link>.</span>}
                control={
                  <Checkbox
                    tabIndex={-1}
                    checked={this.props.acceptedTerms}
                    onClick={this.toggleAcceptTerms.bind(this)}
                    checkedIcon={<Check className={classes.checkedIcon} />}
                    icon={<Check className={classes.uncheckedIcon} />}
                    classes={{ checked: classes.checked }}
                  />
                }
              />
            </Grid>
          </Grid>
        </form>
      )
    }
  }
}

export default withStyles(style)(Step1)

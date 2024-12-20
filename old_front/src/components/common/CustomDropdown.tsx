import { Component } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

interface DropdownState {
  dropdownOpen: boolean;
}

class CustomDropdown extends Component<{}, DropdownState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };
  }

  toggle = () => {
    this.setState((prevState) => ({
      dropdownOpen: !prevState.dropdownOpen,
    }));
  };

  render() {
    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle caret>Lang</DropdownToggle>
        <DropdownMenu>
          <DropdownItem>english</DropdownItem>
          <DropdownItem>español</DropdownItem>
          <DropdownItem>한국어</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

export default CustomDropdown;

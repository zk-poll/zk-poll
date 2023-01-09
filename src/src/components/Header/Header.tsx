import Modal from "../Modal/Modal";
import React, { CSSProperties } from "react";
import styled from "styled-components";

const HeaderContainer = styled.div`
    display: 'flex';
    flex-direction: 'row-reverse';
    /* margin: '0 20px 0 0';
    padding: '0';
    justify-self: 'end';
    font-size: '40px';
    border: 'none';
    background: 'none';
    outline: 'none'; */
    transition: '0.1s';
`

const Header: React.FunctionComponent = () => {
  return (
      <div className="HeaderContainer">
        <Modal />
      </div>

  );
};

export default Header;

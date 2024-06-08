import React from 'react'
import background from '../assets/login.jpg'
import styled from 'styled-components'
import { Container } from 'react-bootstrap'

export default function BackgroundImage() {
  return (
    <StyledContainer>
      <img src={background} alt="background" />
    </StyledContainer>
   
  )
}

const StyledContainer = styled.div`
height: 100vh;
width: 100vw;
img {
  height: 100vh;
  width: 100vw;
  object-fit: cover;
}
`;
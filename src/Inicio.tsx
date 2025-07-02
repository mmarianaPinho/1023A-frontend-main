import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
//import './index.css'
//import App from './App.tsx'
//import Container from './Container.tsx'
import Pagina from './Doces'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Container nome='Header'/>
    <Container nome='Body'/>
    <Container nome='Footer'/> */}
    <Pagina/>
  </StrictMode>,
)
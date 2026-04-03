import './App.css'
import { DataProvider } from './context/DataContext'
import Component1 from './components/Component1'
function App() {
  const name ='waleed'
  return (
    <DataProvider>
      <Component1 />
    </DataProvider>
  )
}

export default App

import { useContext } from 'react'
import { DataContext } from '../context/DataContext'
import Component2 from './Component2'

const   Component1 = () => {
  const { data, loading } = useContext(DataContext)

  return (
    <div className="container">
      <h1>Component 1 - Displaying Products</h1>
      {loading && <p>Loading...</p>}
      
      {!loading && (
        <ul className="task-list">
          {data.map((p) => (
            <li key={p._id || p.id} className="task-item">
              <div className="title">Product Name: {p.productName}</div>
              <div className="desc">Firm: {p.firmName}</div>
              <div className="desc">Price: ${p.price}</div>
              <span className="status">Qty: {p.quantity}</span>
            </li>
          ))}
          {data.length === 0 && <li>No products found.</li>}
        </ul>
      )}
      
      <Component2 />
    </div>
  )
}

export default Component1

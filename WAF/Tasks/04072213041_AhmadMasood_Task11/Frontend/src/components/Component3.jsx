import { useContext, useEffect } from 'react'
import axios from 'axios'
import { DataContext } from '../context/DataContext'

const Component3 = () => {
  const { setData, setLoading } = useContext(DataContext)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const res = await axios.get('http://localhost:4000/db/products')
        setData(res.data || [])
      } catch (err) {
        console.error('Error fetching products:', err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [setData, setLoading])

  return (
    <div style={{ marginTop: '10px', padding: '10px', border: '2px solid #999' }}>
      <h3>Component 3 - Data Fetcher</h3>
      <p>This component fetches data and updates the context</p>
    </div>
  )
}

export default Component3

import Component3 from './Component3'

const Component2 = () => {
  return (
    <div style={{ marginTop: '20px', padding: '10px', border: '2px solid #ccc' }}>
      <h2>Component 2 - Middle Layer</h2>
      <p>This component contains Component 3</p>
      <Component3 />
    </div>
  )
}

export default Component2

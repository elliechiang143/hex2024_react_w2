import axios from 'axios';
import { useState } from 'react'

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

function App() {
  const [isAuth, setIsAuth] = useState(false);

  const [tempProduct, setTempProduct] = useState({});
  const [products, setProducts] = useState([]);

  const [account, setAccount] = useState({
    username: "",
    password: ""
  })

  const handleInputChange = (e) =>{
    const {value, name} = e.target;
    setAccount({
      ...account,
      [name]: value
    })
  }

  const handleLogin = (e) =>{
    e.preventDefault();
    axios.post(`${BASE_URL}/admin/signin`, account)
    .then((res) =>{
      const {token, expired} = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)}`;

      axios.defaults.headers.common['Authorization'] = token;

      axios.get(`${BASE_URL}/api/${API_PATH}/admin/products`)
      .then((res) =>{
        setProducts(res.data.products)
      }).catch((error) =>{
        console.log(error)
      })
      setIsAuth(true);
    })
    .catch((error) =>{
      alert('登入失敗')
    })
  }

  const checkUserLogin = () =>{
    axios.post(`${BASE_URL}/api/user/check`)
    .then((res) => alert('使用者已登入'))
    .catch((error) => console.error(error))
  }

  return (
    <>
    {isAuth ? <div>
          <div className="container">
            <div className="row mt-5">
              <div className="col-md-6">
                <button type='button' className='btn btn-success mb-5' onClick={checkUserLogin}>是否登入</button>
                <h2>產品列表</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th>產品名稱</th>
                      <th>原價</th>
                      <th>售價</th>
                      <th>是否啟用</th>
                      <th>查看細節</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id}>
                        <td>{product.title}</td>
                        <td>{product.origin_price}</td>
                        <td>{product.price}</td>
                        <td>{product.is_enabled}</td>
                        <td><button type="button" className="btn btn-primary" onClick={() => {setTempProduct(product)}}>查看細節</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="col-md-6">
                <h2>單一產品細節</h2>
                {tempProduct.title ? (<div className="card mb-3">
                  <img className="card-img-top primary-image" alt="主圖" src={tempProduct.imageUrl} />
                  <div className="card-body">
                    <h5 className="card-title">
                      {tempProduct.title}
                      <span className="badge bg-primary ms-2">{tempProduct.category}</span>
                    </h5>
                    <p className="card-text">商品描述：{tempProduct.description}</p>
                    <p className="card-text">商品內容：{tempProduct.content}</p>
                    <div className="d-flex">
                      <p className="card-text text-secondary"><del>{tempProduct.origin_price}</del></p>
                      元 / {tempProduct.price} 元
                    </div>
                    <h5 className="mt-3">更多圖片：</h5>
                    <div className="d-flex flex-wrap">
                      {tempProduct.imagesUrl?.map((img, index) => ( <img className="card-text" style={{maxWidth: '100%'}} src={img} key={index} /> ))}
                    </div>
                  </div>
                </div>) : (
                  <p>請選擇一個商品查看</p>
                )}
              </div>
            </div>
          </div>
        </div> : <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <h1 className="mb-5">請先登入</h1>
      <form onSubmit={handleLogin} className="d-flex flex-column gap-3">
        <div className="form-floating mb-3">
          <input name="username" value={account.username} onChange={handleInputChange} type="email" className="form-control" id="username" placeholder="name@example.com" />
          <label htmlFor="username">Email address</label>
        </div>
        <div className="form-floating">
          <input name="password" value={account.password} onChange={handleInputChange} type="password" className="form-control" id="password" placeholder="password" />
          <label htmlFor="password">Password</label>
        </div>
        <button className="btn btn-primary">登入</button>
      </form>
      <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
    </div>}
    </>
  )
}

export default App

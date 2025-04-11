import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Register from '../pages/Register';
import Login from '../pages/Login';
import CreatePost from '../pages/CreateBlog';
import MyPosts from '../pages/MyPosts';
import EditBlog from '../pages/EditBlog';
import BlogDetail from '../pages/BlogDetail';
import ForgotPassword from '../components/ForgotPassword.jsx';
import ResetPassword from '../components/ResetPassword.jsx';

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/createBlog" element={<CreatePost />} />
          <Route path="/my-posts" element={<MyPosts />} />
          <Route path="/editBlog/:id" element={<EditBlog />} />
          <Route path="/blogs/:id" element={<BlogDetail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>
      </Layout>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default App;
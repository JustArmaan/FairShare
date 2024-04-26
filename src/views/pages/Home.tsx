import { Html } from '../components/Html';

export const Home = () => {
  return (
    <Html>
      <h1>Hello IDSP!</h1>
      <div id="logged_out_view">
        <a href="/login">Sign in</a>
        <a href="/register">Register</a>
      </div>
    </Html>
  );
};

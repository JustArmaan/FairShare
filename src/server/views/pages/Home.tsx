import { Html } from "../components/Html";

export const Home = () => {
  return (
    <Html>
      <h1>Hello IDSP!</h1>
      <div id="logged_out_view" >
        <a href="/login" >Sign in</a>
        <br />
        <a href="/register" class="text-blue">Register</a>
      </div>
    </Html>
  );
};

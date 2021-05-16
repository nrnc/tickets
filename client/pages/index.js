import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  return currentUser ? (
    <h1 className="m-auto col-md-4 col-md-offset-4">You are signed in</h1>
  ) : (
    <h1 className="m-auto col-md-4 col-md-offset-4">You are NOT signed in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  console.log("LANDING PAGE!");
  const client = buildClient(context);
  const { data } = await client.get("/api/users/currentuser");

  return data;
};

export default LandingPage;

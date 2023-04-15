function App() {
  return (
    <div className={"w-screen h-screen flex justify-center items-center"}>
      <div className={"flex"}>
        <p className={"text-6xl"}>
          <a
            href={"https://github.com/olivier-deschenes"}
            className={"text-blue-500 hover:underline"}
            target={"_blank"}
            rel="noreferrer"
          >
            olivier-deschenes
          </a>{" "}
          <code className={"bg-gray-100 p-0.5 rounded"}>React</code> starter
          kit.
        </p>
      </div>
    </div>
  );
}

export default App;

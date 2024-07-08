import dynamic from "next/dynamic";

const LayoutComponent = dynamic(() => import("@/layout"));

export default function Main({ }) {

  return (
    <>
      <LayoutComponent metaTitle="Home">
        <h1>Home</h1>
      </LayoutComponent>
    </>
  );
}

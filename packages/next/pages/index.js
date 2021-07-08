export default function Index({}) {
  return <div>root</div>;
}

export async function getServerSideProps(context) {
  return {
    props: {},
  };
}

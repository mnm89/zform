"use client";

import dynamic from "next/dynamic";

const DynamicComponent = ({ example }: { example: string }) => {
  const Component = dynamic(() => import(`../examples/${example}`), {
    loading: () => <div>Loading...</div>,
    ssr: false, // Disable SSR for this client component
  });

  return <Component />;
};

export default DynamicComponent;

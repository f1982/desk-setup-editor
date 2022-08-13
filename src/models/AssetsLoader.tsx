import React, { PropsWithChildren, useState } from 'react'

const AssetsLoader: React.FC<PropsWithChildren> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  return (
    <>
      {
        isLoading === true
          ? (
            <div> loading....</div >
          )
          : (
            <div>{children}</div>
          )
      }
    </>)
}

export default AssetsLoader;
const PageContainer = ({
  children,
  className = "",
  limitedWidth = true,
  marginBottom = false,
  marginTop = false,
}) => {
  return (
    <div
      className={`scrollbar-hidden w-full mx-auto px-4 lg:px-0 ${marginTop && "mt-20"} ${marginBottom && "mb-20"}  ${limitedWidth && "max-w-5xl"} ${className}`}
    >
      {children}
    </div>
  );
};

export default PageContainer;

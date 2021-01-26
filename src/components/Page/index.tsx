import PageWrapper from "./components/PageWrapper";
import Header from "./components/Header";
import MainContent from "./components/MainContent";

interface IPage {
  children: any;
}

function Page({ children }: IPage) {
  return (
    <PageWrapper>
      <Header />
      <MainContent>
        {children}
      </MainContent>
    </PageWrapper>
  )
}

export default Page;

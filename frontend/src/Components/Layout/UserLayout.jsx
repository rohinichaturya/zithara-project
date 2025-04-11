import Footer from "../Common/Footer"
import Header from "../Common/Header"
import Quality from "../Common/Quality"
import Category from "../Products/Category"
import Covered from "../Products/Covered"
import Gender from "../Products/Gender"
import Landing from "./Landing"


const UserLayout = () => {
  return (
    <>
        <Header />
        <Landing />
        <Category />
        <Gender />
        <Covered />
        <Quality />
        <Footer />
        
    </>
  )
}

export default UserLayout
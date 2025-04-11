import Navbar from '../Layout/Navbar'
import PList from '../Layout/PList'
import Topbar from '../Layout/Topbar'

const Header = () => {
  return (
    <>
      <header>
        <Topbar />
        <Navbar />
        <PList className="hidden md:block" /> {/* Hidden on mobile, visible on md+ */}
      </header>
    </>
  )
}

export default Header

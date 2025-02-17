import { Link, Outlet } from "react-router-dom";

export const Dashboard = () => {
    return (
        <>
          <header className="navbar navbar-dark sticky-top bg-primary flex-md-nowrap p-2 shadow">
            <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="#">
              Dashboard
            </a>
    
            <div className="navbar-nav">
              <div className="nav-item text-nowrap">
                <Link to="/login" className="text-light">
                  Cerrar sesión
                </Link>
              </div>
            </div>
          </header>
          <div className="container-fluid">
            <div className="row vh-100">
              <nav
                id="sidebarMenu"
                className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse"
              >
                <div className="position-sticky pt-3">
                  <ul className="nav flex-column">
                    <li className="nav-item">
                      <Link to="/dashboard/home" className="text-primary">
                        Home
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/dashboard/page1" className="text-primary">
                        Page 1
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/dashboard/page2" className="text-primary">
                       Page 2
                      </Link>
                    </li>
                  </ul>
                </div>
              </nav>
              <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <Outlet />
              </main>
            </div>
          </div>
        </>
      );
}
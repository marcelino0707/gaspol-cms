import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ onToggleSidebar, isOpen, userTokenData }) => {
  const hasAccess = (accessCode) => {
    const menuAccess = userTokenData.menu_access;
    console.log('Menu Access Type:', typeof userTokenData.menu_access);
    console.log('Menu Access Value:', userTokenData.menu_access);
    // Multiple type-safe checks
    if (Array.isArray(menuAccess)) {
      return menuAccess.includes(accessCode) ||
        menuAccess.includes(Number(accessCode)) ||
        menuAccess.includes(String(accessCode));
    }

    if (typeof menuAccess === 'string') {
      return menuAccess.split(',').includes(String(accessCode));
    }

    return false;
  };
  return (
    <div id="sidebar" className={`sidebar ${isOpen ? "active" : ""}`}>
      <div className="sidebar-wrapper active">
        <div className="sidebar-header position-relative">
          <div className="d-flex justify-content-between align-items-center">
            <div className="logo">
              <Link to="/">GASPOLL CMS</Link>
            </div>
            <div className="sidebar-toggler" onClick={onToggleSidebar}>
              <div className="sidebar-hide d-xl-none d-block">
                <i className="bi bi-x bi-middle"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="sidebar-menu">
          <ul class="menu">
            <li class="sidebar-title">Menu</li>
            {userTokenData.menu_access.includes("1") && (
              <><li class="sidebar-item">
                <Link to="/" class="sidebar-link">
                  <i className="bi bi-tags-fill"></i>
                  <span>Management Users</span>
                </Link>
              </li><li class="sidebar-item">
                  <Link to="/outlet" class="sidebar-link">
                    <i className="bi bi-building"></i>
                    <span>Management Outlet</span>
                  </Link>
                </li></>
            )}
            {userTokenData.menu_access.includes("2") && (
              <li class="sidebar-item">
                <Link to="/menu" class="sidebar-link">
                  <i className="bi bi-cup-straw"></i>
                  <span>Management Menus</span>
                </Link>
              </li>
            )}
            {userTokenData.menu_access.includes("3") && (
              <li class="sidebar-item">
                <Link to="/discount" class="sidebar-link">
                  <i className="bi bi-tags-fill"></i>
                  <span>Management Discounts</span>
                </Link>
              </li>
            )}
            {userTokenData.menu_access.includes("5") && (
              <li class="sidebar-item">
                <Link to="/serving-type" class="sidebar-link">
                  <i className="bi bi-currency-exchange"></i>
                  <span>Serving Types</span>
                </Link>
              </li>
            )}
            {userTokenData.menu_access.includes("8") && (
              <li class="sidebar-item">
                <Link to="/payment-type" class="sidebar-link">
                  <i className="bi bi-bank"></i>
                  <span>Payment Types</span>
                </Link>
              </li>
            )}
            {userTokenData.menu_access.includes("10") && (
              <li class="sidebar-item">
                <Link to="/payment-management" class="sidebar-link">
                  <i className="bi bi-bank"></i>
                  <span>Payment Categories</span>
                </Link>
              </li>
            )}
            {userTokenData.menu_access.includes("9") && (
              <li className="sidebar-item">
                <Link to="/member" className="sidebar-link">
                  <i className="bi bi-people-fill"></i>
                  <span>Management Membership</span>
                </Link>
              </li>
            )}
            {userTokenData.menu_access.includes("4") && (
              <li class="sidebar-item">
                <Link to="/report" class="sidebar-link">
                  <i className="bi bi-book"></i>
                  <span>Reports</span>
                </Link>
              </li>
            )}
            {userTokenData.menu_access.includes("6") && (
              <li class="sidebar-item">
                <Link to="/ingredient-order" class="sidebar-link">
                  <i className="bi bi-clipboard-check"></i>
                  <span>Ingredients Order</span>
                </Link>
              </li>
            )}
            {userTokenData.menu_access.includes("7") && (
              <li class="sidebar-item">
                <Link to="/ingredient-report" class="sidebar-link">
                  <i className="bi bi-box-seam"></i>
                  <span>Ingredients Report</span>
                </Link>
              </li>
            )}
            {userTokenData.role === "Warehouse" && (
              <>
                <li class="sidebar-item">
                  <Link to="/ingredient" class="sidebar-link">
                    <i className="bi bi-basket"></i>
                    <span>Ingredients</span>
                  </Link>
                </li>
                <li class="sidebar-item">
                  <Link to="/ingredient-order-outlet" class="sidebar-link">
                    <i className="bi bi-basket"></i>
                    <span>Ingredients Order Outlet</span>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

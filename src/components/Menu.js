import React, { useState, useEffect } from "react";
import { MenuModal } from "../components/MenuModal";
import axios from "axios";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const Menu = ({userTokenData}) => {
  const [menus, setMenus] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedMenuId, setSelectedMenuId] = useState(null);

  useEffect(() => {
    getMenus();
  }, []);

  useEffect(() => {
    if (showModal) {
      document.body.classList.add("modal-open");
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "0px";
    } else {
      document.body.classList.remove("modal-open");
      document.body.style.removeProperty("overflow", "padding-right");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [showModal]);

  const getMenus = async () => {
    const response = await axios.get(`${apiBaseUrl}/v2/menu`, {
      params: {
        outlet_id: userTokenData.outlet_id
      }
    });
    setMenus(response.data.data);
  };

  const openModal = (menuId) => {
    setSelectedMenuId(menuId);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleSaveMenu = async (newMenu) => {
    setMenus([...menus, newMenu]);
    closeModal();

    try {
      await getMenus();
    } catch (error) {
      console.error("Error fetching menus:", error);
    }
  };

  return (
    <div>
      <div className="page-heading">
        <div className="page-title">
          <div className="row">
            <div className="col-12 col-md-6 order-md-1 order-last mb-3">
              <h3>Management Menu</h3>
            </div>
          </div>
        </div>
        <section class="section">
          <div class="card">
            <div class="card-header">
              <div class="float-lg-end">
                <div
                  className="button btn btn-primary rounded-pill"
                  onClick={() => openModal(null)}
                >
                  <i class="bi bi-plus"></i> Tambah Data
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="grid-container">
                {menus.map((menu, index) => (
                  <div className="grid-card" key={menu.id}>
                    <img
                      className="card-image"
                      src={
                        menu.image_url
                          ? `${apiBaseUrl}/${menu.image_url}`
                          : "/assets/images/menu-template.svg"
                      }
                      alt="Menu"
                    />
                    <div className="card-content">
                      <h7 style={{ fontWeight: 'bold', color: menu.is_active === 1 ? 'green' : 'red' }}>{menu.is_active === 1 ? "Aktif" : "Tidak Aktif"}</h7>
                      <h4>{menu.name}</h4>
                      <h6 className="mb-3">- {menu.menu_type} -</h6>
                      <h6 style={{fontWeight: 'bold'}}>Rp. {menu.price}</h6>
                      <div className="action-buttons">
                        <button
                          className="btn info btn-primary"
                          onClick={() => openModal(menu.id)}
                        >
                          <i className="bi bi-pencil"></i> Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      <MenuModal
        show={showModal}
        onClose={closeModal}
        onSave={handleSaveMenu}
        selectedMenuId={selectedMenuId}
        getMenus={getMenus}
        userTokenData={userTokenData}
      />
    </div>
  );
};

export default Menu;

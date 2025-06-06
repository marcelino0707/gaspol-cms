import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

const IngredientOrderList = ({ userTokenData }) => {
    const [ingredientTypes, setIngredientTypes] = useState([]);
    const [ingredientUnitTypes, setIngredientUnitTypes] = useState([]);
    const [ingredientOrderLists, setIngredientOrderLists] = useState([]);
    const [ingredientOrderListDetails, setIngredientOrderListDetails] = useState([]);
    const [ingredientOrderBarListDetails, setIngredientOrderBarListDetails] = useState([]);
    const [displayStorageOutletType, setDisplayStorageOutletType] = useState(0);
    const [dateTimeFormatNow, setDateTimeFormatNow] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        getOrderList();
    }, []);

    const getOrderList = async () => {
        const response = await axios.get(`${apiBaseUrl}/ingredient-order`, {
            params: {
                outlet_id: userTokenData.outlet_id,
            },
        });
        setIngredientOrderLists(response.data.data.ingredient_order_lists);
        setIngredientOrderListDetails(response.data.data.ingredient_order_list_details);
        setIngredientOrderBarListDetails(response.data.data.ingredient_order_bar_list_details);
        setIngredientTypes(response.data.data.ingredient_types);
        setIngredientUnitTypes(response.data.data.ingredient_unit_types);
        setDateTimeFormatNow(response.data.data.date_time_now);
    };

    const handleEditButton = () => {
        setIsEditing(true);
      };
    
      const handleCancelButton = () => {
        setIsEditing(false);
      };

    const handleDisplayStorageOutletTypeChange = (type) => {
        setDisplayStorageOutletType(type);
    };

    const handleInputChange = (detailId, field, value) => {
        const numericValue = parseFloat(value);
        const updatedKitchenDetails = ingredientOrderListDetails.map(detail => {
            if (detail.ingredient_order_list_detail_id === detailId) {
                return {
                    ...detail,
                    [field]: numericValue,
                };
            }
            return detail;
        });

        const updatedBarDetails = ingredientOrderBarListDetails.map(detail => {
            if (detail.ingredient_order_list_detail_id === detailId) {
                return {
                    ...detail,
                    [field]: numericValue,
                };
            }
            return detail;
        });

        setIngredientOrderListDetails(updatedKitchenDetails);
        setIngredientOrderBarListDetails(updatedBarDetails);
    };

    const updatedOrderLists = (field, value) => {
        setIngredientOrderLists(prevLists => {
            const updatedLists = [...prevLists];
            updatedLists[displayStorageOutletType] = {
                ...updatedLists[displayStorageOutletType],
                [field]: value,
            };
            return updatedLists;
        });
    };

    const handleSaveButton = async () => {
        try {
            const payload = {
                ingredient_order_lists: ingredientOrderLists.map(orderList => ({
                    id: orderList.id,
                    pembuat_order: orderList.pembuat_order || '',
                    penanggung_jawab: orderList.penanggung_jawab || '',
                    penerima: orderList.penerima || '',
                    pengirim: orderList.pengirim || '',
                })),
                ingredient_order_list_details: [...ingredientOrderListDetails, ...ingredientOrderBarListDetails].map(detail => ({
                    ingredient_order_list_detail_id: detail.ingredient_order_list_detail_id,
                    order_request_quantity: detail.order_request_quantity || 0,
                    leftover: detail.leftover || 0,
                    real: detail.real || 0,
                })),
            };

            await axios.patch(`${apiBaseUrl}/ingredient-order`, payload);
            setIsEditing(false);

            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Laporan bahan baku berhasil diubah!",
            });
        } catch (error) {
            console.error("Failed to save data:", error.message);
        }
    };

    const displayDetails = displayStorageOutletType === 0 ? ingredientOrderListDetails : ingredientOrderBarListDetails;

    return (
        <>
            <h3 class="text-center">Laporan Bahan Baku {userTokenData.outlet_name}</h3>
            <h5 class="text-center mb-4">{dateTimeFormatNow}</h5>
            <div class="row match-height justify-content-center">
                {ingredientOrderLists !== 0 && (
                    <div class="col-8">
                        <div className="row row-nav">
                            {ingredientOrderLists.length > 1 && (
                                <>
                                    <div className={`card card-nav`}>
                                        <button
                                            className="card-header"
                                            onClick={() => handleDisplayStorageOutletTypeChange(0)}
                                        >
                                            <h5 class="card-title text-center">Kitchen</h5>
                                        </button>
                                    </div>
                                    <div className={`card card-nav`}>
                                        <button
                                            className="card-header"
                                            onClick={() => handleDisplayStorageOutletTypeChange(1)}
                                        >
                                            <h5 class="card-title text-center">Bar</h5>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                        <div class="card">
                            <div class="card-content">
                                <div className="full-height">
                                    <table className="table my-3">
                                        <thead>
                                            <tr>
                                                <th class="col-3 text-center">Pembuat Order</th>
                                                <th class="col-3 text-center">Penanggung Jawab</th>
                                                <th class="col-3 text-center">Penerima</th>
                                                <th class="col-3 text-center">Pengirim</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={ingredientOrderLists[displayStorageOutletType]?.pembuat_order || ""}
                                                        class="form-control text-center"
                                                        onChange={(e) => updatedOrderLists('pembuat_order', e.target.value)}
                                                        disabled={!isEditing}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={ingredientOrderLists[displayStorageOutletType]?.penanggung_jawab || ""}
                                                        class="form-control text-center"
                                                        onChange={(e) => updatedOrderLists('penanggung_jawab', e.target.value)}
                                                        disabled={!isEditing}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={ingredientOrderLists[displayStorageOutletType]?.penerima || ""}
                                                        class="form-control text-center"
                                                        onChange={(e) => updatedOrderLists('penerima', e.target.value)}
                                                        disabled={!isEditing}
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        value={ingredientOrderLists[displayStorageOutletType]?.pengirim || ""}
                                                        class="form-control text-center"
                                                        onChange={(e) => updatedOrderLists('pengirim', e.target.value)}
                                                        disabled={!isEditing}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div class="card-body scrollable-content">
                                        {ingredientTypes.map((type) => {
                                            const filteredDetails = displayDetails.filter(
                                                (detail) => detail.ingredient_type_id === type.id
                                            );

                                            // Skip rendering if there are no details for the current ingredient_type
                                            if (filteredDetails.length === 0) {
                                                return null;
                                            }
                                            return (
                                                <div key={type.id}>
                                                    <h5 className="text-center py-2" style={{ backgroundColor: "#f8f9fa" }}>{type.name}</h5>
                                                    <table class="table">
                                                        <thead>
                                                            <tr>
                                                                <th class="col-4">Nama</th>
                                                                <th class="col-2 text-center">Sisa</th>
                                                                <th class="col-2 text-center">Order</th>
                                                                <th class="col-2 text-center">Real</th>
                                                                <th class="col-2 text-center">Kuantitas Order</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filteredDetails.map((filteredDetail) => {
                                                                const ingredientUnitType = ingredientUnitTypes.find(
                                                                    (unitType) => unitType.id === filteredDetail.ingredient_unit_type_id
                                                                );

                                                                return (
                                                                    <tr
                                                                        key={
                                                                            filteredDetail.ingredient_order_list_detail_id
                                                                        }
                                                                    >
                                                                        <td>{filteredDetail.ingredient_name}</td>
                                                                        <td>
                                                                            {/* leftover */}
                                                                            <input
                                                                                type="number"
                                                                                value={filteredDetail.leftover || ""}
                                                                                onChange={(e) => handleInputChange(filteredDetail.ingredient_order_list_detail_id, 'leftover', e.target.value)}
                                                                                class="form-control text-center"
                                                                                disabled={!isEditing}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            {/* order_request_quantity */}
                                                                            <input
                                                                                type="number"
                                                                                value={filteredDetail.order_request_quantity || ""}
                                                                                onChange={(e) => handleInputChange(filteredDetail.ingredient_order_list_detail_id, 'order_request_quantity', e.target.value)}
                                                                                class="form-control text-center"
                                                                                disabled={!isEditing}
                                                                            />
                                                                        </td>
                                                                        <td>
                                                                            {/* real */}
                                                                            <input
                                                                                type="number"
                                                                                value={filteredDetail.real || ""}
                                                                                onChange={(e) => handleInputChange(filteredDetail.ingredient_order_list_detail_id, 'real', e.target.value)}
                                                                                class="form-control text-center"
                                                                                disabled={!isEditing}
                                                                            />
                                                                        </td>
                                                                        <td className="text-center">{filteredDetail.order_quantity} {ingredientUnitType?.name}</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                    <br></br>
                                                    <br></br>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div class="my-3 d-flex justify-content-center">
                                    {isEditing ? (
                                        <>
                                            <button
                                                type="button"
                                                className="btn btn-secondary mb-1 mx-2"
                                                onClick={handleCancelButton}
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn-primary mb-1"
                                                onClick={handleSaveButton}
                                            >
                                                Simpan
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-primary mb-1"
                                            onClick={handleEditButton}
                                        >
                                            Edit
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default IngredientOrderList;

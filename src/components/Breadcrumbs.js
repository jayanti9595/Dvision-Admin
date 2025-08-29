import React from "react";
import "../assets/css/breadcrumbs.scss";

const Breadcrumbs = ({ title, items }) => {
  return (
    <div>
      <div className="row">
        <div className="col-lg-12">
          <div className="mc-card">
            <div className="mc-breadcrumb">
              <h3 className="mc-breadcrumb-title">{title}</h3>
              <ul className="mc-breadcrumb-list">
                {items.map((item, index) => (
                  <li key={index} className="mc-breadcrumb-item">
                    <a className="mc-breadcrumb-link" href={item.path}>
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumbs;

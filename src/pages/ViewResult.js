/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';
import '../assets/css/users.scss';
import { API_URL, APP_LOGO, APP_PREFIX_PATH, IMAGE_PATH } from "../config/AppConfig";
import Breadcrumbs from "../components/Breadcrumbs";
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { decode as base64_decode } from 'base-64';
import { FaDownload, FaEye } from 'react-icons/fa';
import jsPDF from 'jspdf';

// Custom styles for enhanced design
const customStyles = {
  headerCard: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderRadius: '15px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
  },
  tableCard: {
    borderRadius: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: 'none'
  },
  badge: {
    borderRadius: '20px',
    padding: '8px 16px',
    fontSize: '0.875rem'
  },
  button: {
    borderRadius: '25px',
    padding: '10px 20px',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  }
};

const ViewResult = () => {
  const { quiz_id } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const token = sessionStorage.getItem('token');

  const breadcrumbItems = [
    { label: "Dashboard", path: `/${APP_PREFIX_PATH}/dashboard` },
    { label: "Manage Quiz", path: `/${APP_PREFIX_PATH}/manage-quiz` },
    { label: "View Result", path: `/${APP_PREFIX_PATH}/view-result/${quiz_id}` },
  ];

  useEffect(() => {
    if (!quiz_id) return;
    setLoading(true);
    setError('');
    const decodedQuizId = base64_decode(quiz_id);
    axios.get(`${API_URL}/get_quiz_result_student?quiz_id=${decodedQuizId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      if (res.data?.key === 'authenticateFailed') {
        sessionStorage.clear();
        navigate(`/${APP_PREFIX_PATH}/`);
        return;
      }
      if (res.data?.success) {
        setResults(res.data?.data || []);
      } else {
        setResults([]);
        setError(res.data?.msg?.[0] || 'No data found');
      }
    }).catch(() => {
      setResults([]);
      setError('Failed to fetch quiz results');
    }).finally(() => setLoading(false));
  }, [quiz_id]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = results.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(results.length / usersPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset to first page when results change
  useEffect(() => {
    setCurrentPage(1);
  }, [results]);

  // Download quiz results as PDF
  const downloadResults = async () => {
    if (!results || results.length === 0) return;
    
    const doc = new jsPDF();
    
    // Add logo
    try {
      doc.addImage('/logo192.png', 'PNG', 20, 10, 25, 25);
    } catch (error) {
      console.log('Logo not loaded, continuing without logo');
    }
    
    // Add title with better styling
    doc.setFontSize(24);
    doc.setTextColor(44, 62, 80); // Dark blue color
    doc.text('Quiz Results Report', 105, 25, { align: 'center' });
    
    // Add subtitle
    doc.setFontSize(14);
    doc.setTextColor(52, 73, 94); // Lighter blue
    doc.text('Dvision Academic Performance Summary', 105, 35, { align: 'center' });
    
    // Add decorative line
    doc.setDrawColor(52, 73, 94);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);
    
    // Add quiz info in a styled box
    doc.setFillColor(236, 240, 241); // Light gray background
    doc.rect(20, 50, 170, 25, 'F');
    doc.setDrawColor(52, 73, 94);
    doc.rect(20, 50, 170, 25, 'S');
    
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.setFont(undefined, 'bold');
    doc.text('Quiz Information:', 25, 60);
    doc.setFont(undefined, 'normal');
    doc.text(`Quiz ID: ${base64_decode(quiz_id)}`, 25, 70);
    doc.text(`Total Students: ${results.length}`, 25, 80);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 120, 70);
    doc.text(`Time: ${new Date().toLocaleTimeString()}`, 120, 80);
    
    // Add table with better styling
    doc.setFillColor(52, 73, 94); // Header background
    doc.rect(20, 85, 170, 10, 'F');
    
    // Add table headers
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255); // White text for header
    doc.setFont(undefined, 'bold');
    doc.text('S.No', 22, 92);
    doc.text('Image', 35, 92);
    doc.text('Name', 60, 92);
    doc.text('Email', 100, 92);
    doc.text('Percentage', 160, 92);
    
    // Add table data with alternating row colors and images
    doc.setTextColor(44, 62, 80);
    doc.setFont(undefined, 'normal');
    let yPosition = 100;
    
    // Process all images first, then generate PDF
    const imagePromises = results.map(async (result, index) => {
      try {
        const imageUrl = result.image 
          ? `${IMAGE_PATH}${result.image}` 
          : `${IMAGE_PATH}placeholder.png`;
        
        return new Promise((resolve) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = function() {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 20;
            canvas.height = 20;
            ctx.drawImage(img, 0, 0, 20, 20);
            
            try {
              const imgData = canvas.toDataURL('image/jpeg');
              resolve({ index, imgData, success: true });
            } catch (e) {
              resolve({ index, success: false });
            }
          };
          img.onerror = () => resolve({ index, success: false });
          img.src = imageUrl;
        });
      } catch (error) {
        return { index, success: false };
      }
    });
    
    // Wait for all images to load
    const imageResults = await Promise.all(imagePromises);
    const imageMap = new Map();
    imageResults.forEach(result => {
      if (result.success) {
        imageMap.set(result.index, result.imgData);
      }
    });
    
    // Now generate the PDF with images
    results.forEach((result, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
        
        // Add header on new page
        doc.setFontSize(18);
        doc.setTextColor(44, 62, 80);
        doc.text('Quiz Results Report (Continued)', 105, 15, { align: 'center' });
        doc.setFontSize(10);
      }
      
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(248, 249, 250); // Light gray
        doc.rect(20, yPosition - 5, 170, 12, 'F');
      }
      
      // Add user image if available
      if (imageMap.has(index)) {
        try {
          doc.addImage(imageMap.get(index), 'JPEG', 35, yPosition - 3, 8, 8);
        } catch (e) {
          console.log('Could not add image to PDF');
        }
      }
      
      doc.text(String(index + 1), 22, yPosition);
      doc.text(String(result.name || 'NA'), 60, yPosition);
      doc.text(String(result.email || 'NA'), 100, yPosition);
      doc.text(String(result.percentage || '0%'), 160, yPosition);
      
      yPosition += 12;
    });
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('This is an official document generated by the system.', 105, yPosition + 10, { align: 'center' });
    
    // Save PDF
    doc.save(`quiz_${base64_decode(quiz_id)}_results_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Download individual user data as PDF
  const downloadUserData = async (user) => {
    const doc = new jsPDF();
    
    // Add logo
    try {
      doc.addImage('/logo192.png', 'PNG', 20, 10, 25, 25);
    } catch (error) {
      console.log('Logo not loaded, continuing without logo');
    }
    
    // Add title with better styling
    doc.setFontSize(22);
    doc.setTextColor(44, 62, 80); 
    doc.text(`${user.name} Quiz Result`, 105, 25, { align: 'center' });
    
    // Add subtitle
    doc.setFontSize(14);
    doc.setTextColor(52, 73, 94);
    doc.text('Student Performance Report', 105, 35, { align: 'center' });
    
    // Add decorative line
    doc.setDrawColor(52, 73, 94);
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);
    
    // Add user image prominently
    let imageLoaded = false;
    try {
      const imageUrl = user.image 
        ? `${IMAGE_PATH}${user.image}` 
        : `${IMAGE_PATH}placeholder.png`;
      
      const imgData = await new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = function() {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = 40;
          canvas.height = 40;
          ctx.drawImage(img, 0, 0, 40, 40);
          
          try {
            const imgData = canvas.toDataURL('image/jpeg');
            resolve(imgData);
          } catch (e) {
            resolve(null);
          }
        };
        img.onerror = () => resolve(null);
        img.src = imageUrl;
      });
      
      if (imgData) {
        doc.addImage(imgData, 'JPEG', 20, 50, 20, 20);
        imageLoaded = true;
      }
    } catch (error) {
      console.log('User image loading failed');
    }
    
    // Add user info in a styled box (adjusted for image)
    const infoBoxX = imageLoaded ? 50 : 20;
    const infoBoxWidth = imageLoaded ? 140 : 170;
    
    doc.setFillColor(236, 240, 241); // Light gray background
    doc.rect(infoBoxX, 50, infoBoxWidth, 35, 'F');
    doc.setDrawColor(52, 73, 94);
    doc.rect(infoBoxX, 50, infoBoxWidth, 35, 'S');
    
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.setFont(undefined, 'bold');
    doc.text('Student Information:', infoBoxX + 5, 60);
    doc.setFont(undefined, 'normal');
    doc.text(`Name: ${user.name || 'NA'}`, infoBoxX + 5, 70);
    doc.text(`Email: ${user.email || 'NA'}`, infoBoxX + 5, 80);
    doc.text(`Quiz ID: ${base64_decode(quiz_id)}`, 120, 70);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 120, 80);
    
    // Add results in a styled table
    doc.setFillColor(52, 73, 94); // Header background
    doc.rect(20, 95, 170, 10, 'F');
    
    // Add table headers
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255); // White text for header
    doc.setFont(undefined, 'bold');
    doc.text('Field', 25, 102);
    doc.text('Value', 100, 102);
    
    // Add table data with alternating row colors
    doc.setTextColor(44, 62, 80);
    doc.setFont(undefined, 'normal');
    
    const fields = [
      { label: 'Total Correct Answers', value: String(user.total_correct || '0') },
      { label: 'Total Wrong Answers', value: String(user.total_wrong || '0') },
      { label: 'Percentage Score', value: String(user.percentage || '0%') },
      { label: 'Quiz Completion Time', value: String(user.createtime || 'NA') }
    ];
    
    let yPosition = 115;
    fields.forEach((field, index) => {
      // Alternate row colors
      if (index % 2 === 0) {
        doc.setFillColor(248, 249, 250); // Light gray
        doc.rect(20, yPosition - 5, 170, 8, 'F');
      }
      
      doc.text(field.label, 25, yPosition);
      doc.text(field.value, 100, yPosition);
      yPosition += 8;
    });
    
    // Add performance summary
    yPosition += 10;
    doc.setFillColor(240, 248, 255); // Light blue background
    doc.rect(20, yPosition, 170, 20, 'F');
    doc.setDrawColor(52, 73, 94);
    doc.rect(20, yPosition, 170, 20, 'S');
    
    doc.setFontSize(12);
    doc.setTextColor(44, 62, 80);
    doc.setFont(undefined, 'bold');
    doc.text('Performance Summary:', 25, yPosition + 8);
    doc.setFont(undefined, 'normal');
    
    const percentage = parseFloat(user.percentage) || 0;
    let performance = '';
    let color = '';
    
    if (percentage >= 80) {
      performance = 'Excellent Performance';
      color = '28a745'; // Green
    } else if (percentage >= 60) {
      performance = 'Good Performance';
      color = 'ffc107'; // Yellow
    } else {
      performance = 'Needs Improvement';
      color = 'dc3545'; // Red
    }
    
    doc.setTextColor(parseInt(color.substr(0, 2), 16), parseInt(color.substr(2, 2), 16), parseInt(color.substr(4, 2), 16));
    doc.text(performance, 25, yPosition + 18);
    
    // Add footer
    doc.setFontSize(10);
    doc.setTextColor(128, 128, 128);
    doc.text('This is an official document generated by the system.', 105, yPosition + 35, { align: 'center' });
    
    // Save PDF
    doc.save(`user_${user.user_id}_quiz_${base64_decode(quiz_id)}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="container mt-5">
      <Breadcrumbs title="Quiz Results" items={breadcrumbItems} />
      
      {/* Header Section with Download Button */}
      <div className="mc-card mb-4" style={customStyles.headerCard}>
        <div className="d-flex justify-content-between align-items-center p-4">
          <div className="d-flex align-items-center">
            <div className="me-3">
              <img 
                src={APP_LOGO}
                alt="App Logo" 
                style={{ width: '50px', height: '50px' }}
                className="rounded shadow"
              />
            </div>
            <div>
              <h4 className="mb-1 text-white fw-bold">Quiz Results Dashboard</h4>
              <p className="mb-0 text-white-50">
                <span className="badge bg-white bg-opacity-25 me-2 text-white">Total Students: {results.length}</span>
              </p>
            </div>
          </div>
          <button
            onClick={downloadResults}
            disabled={!results || results.length === 0}
            className="btn btn-light btn-lg d-flex align-items-center gap-2 shadow"
            style={customStyles.button}
          >
            <FaDownload /> Download All Results (PDF)
          </button>
        </div>
      </div>

      <div className="mc-card shadow-sm" style={customStyles.tableCard}>
        {loading ? (
          <div className="p-5 text-center">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Loading quiz results...</p>
          </div>
        ) : error ? (
          <div className="p-5 text-center">
            <div className="text-danger mb-3">
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '3rem' }}></i>
            </div>
            <h5 className="text-danger">{error}</h5>
          </div>
        ) : (
          <div className="mc-table-responsive">
            <div className="table-container">
              <table className="table table-hover table-striped mb-0">
                <thead className='table-dark'>
                  <tr>
                    <th className="text-center border-0" style={{width: '60px'}}>S No.</th>
                    <th className="text-center border-0" style={{width: '80px'}}>Image</th>
                    <th className="border-0">Name</th>
                    <th className="border-0">Email</th>
                    <th className="text-center border-0">Total Correct</th>
                    <th className="text-center border-0">Total Wrong</th>
                    <th className="text-center border-0">Percentage</th>
                    <th className="text-center border-0">Create Time</th>
                    <th className="text-center border-0" style={{width: '100px'}}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers && currentUsers.length > 0 ? (
                    currentUsers.map((result, idx) => (
                      <tr key={result.user_id || idx} className="align-middle">
                        <td className="text-center fw-bold text-primary">{indexOfFirstUser + idx + 1}</td>
                        <td className="text-center">
                          <img 
                            alt="user image" 
                            src={result.image
                              ? `${IMAGE_PATH}${result.image}`
                              : `${IMAGE_PATH}placeholder.png`} 
                            style={{ 
                              width: '50px', 
                              height: '50px', 
                              borderRadius: '50%',
                              border: '3px solid #e9ecef',
                              objectFit: 'cover',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }} 
                          />
                        </td>
                        <td className="fw-semibold">{result.name || 'NA'}</td>
                        <td className="text-muted">{result.email || 'NA'}</td>
                        <td className="text-center">
                          <span className="badge bg-success fs-6 px-3 py-2">{result.total_correct || '0'}</span>
                        </td>
                        <td className="text-center">
                          <span className="badge bg-danger fs-6 px-3 py-2">{result.total_wrong || '0'}</span>
                        </td>
                        <td className="text-center">
                          <span 
                            className="badge fs-6 px-3 py-2"
                            style={{ 
                              backgroundColor: result.percentage >= '80%' ? '#28a745' : 
                                             result.percentage >= '60%' ? '#ffc107' : '#dc3545',
                              color: 'white',
                              fontSize: '0.875rem'
                            }}
                          >
                            {result.percentage || '0%'}
                          </span>
                        </td>
                        <td className="text-center text-muted small">{result.createtime || 'NA'}</td>
                        <td className="text-center">
                          <button
                            onClick={() => downloadUserData(result)}
                            className="btn btn-sm btn-outline-success shadow-sm"
                            title="Download User Result"
                            style={{ borderRadius: '20px' }}
                          >
                            <FaDownload className="me-1" />
                            PDF
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-5 text-muted">
                        <div className="mb-3">
                          <FaEye style={{fontSize: '3rem', opacity: 0.3}} />
                        </div>
                        <h5 className="text-muted">No quiz results found</h5>
                        <p className="text-muted mb-0">There are no students who have attempted this quiz yet.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Pagination Controls */}
        {!loading && !error && results.length > 0 && (
          <div className="d-flex justify-content-between align-items-center p-4 border-top bg-light">
            <div className="text-muted">
              <i className="fas fa-info-circle me-2"></i>
              Showing <span className="fw-bold text-primary">{indexOfFirstUser + 1}</span> to <span className="fw-bold text-primary">{Math.min(indexOfLastUser, results.length)}</span> of <span className="fw-bold text-success">{results.length}</span> results
            </div>
            <div className="d-flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => handlePageChange(currentPage - 1)}
                className="btn btn-outline-primary btn-sm shadow-sm"
                style={{ borderRadius: '20px' }}
              >
                <i className="fas fa-chevron-left me-1"></i>
                Previous
              </button>
              
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                // Show only current page, first page, last page, and pages around current
                if (
                  pageNum === 1 || 
                  pageNum === totalPages || 
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`btn btn-sm shadow-sm ${currentPage === pageNum ? 'btn-primary' : 'btn-outline-primary'}`}
                      style={{ borderRadius: '20px', minWidth: '40px' }}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (
                  pageNum === currentPage - 2 || 
                  pageNum === currentPage + 2
                ) {
                  return <span key={pageNum} className="px-2 text-muted d-flex align-items-center">...</span>;
                }
                return null;
              })}
              
              <button
                disabled={currentPage === totalPages}
                onClick={() => handlePageChange(currentPage + 1)}
                className="btn btn-outline-primary btn-sm shadow-sm"
                style={{ borderRadius: '20px' }}
              >
                Next
                <i className="fas fa-chevron-right ms-1"></i>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewResult;

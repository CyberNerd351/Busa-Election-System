import React from 'react';

const Contact = () => {
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <h2>Contact Support</h2>
                <p className="text-muted">Get help with any issues or questions about the election</p>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="card text-center h-100">
                    <div className="card-body">
                      <div className="display-1 text-primary mb-3">📧</div>
                      <h5>Email Support</h5>
                      <p className="text-muted">Send us an email for non-urgent inquiries</p>
                      <a href="mailto:peternyagaka5@gmail.com" className="btn btn-outline-primary">
                        peternyagaka5@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card text-center h-100">
                    <div className="card-body">
                      <div className="display-1 text-success mb-3">📞</div>
                      <h5>Phone Support</h5>
                      <p className="text-muted">Call us for immediate assistance</p>
                      <a href="tel:0117067894" className="btn btn-outline-success">
                        0117067894
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <h4>Common Issues</h4>
                <div className="list-group">
                  <div className="list-group-item">
                    <strong>Login Problems:</strong> Ensure you're using the correct email and password provided by the administrator.
                  </div>
                  <div className="list-group-item">
                    <strong>Voting Issues:</strong> Make sure you're voting within the election period and have stable internet connection.
                  </div>
                  <div className="list-group-item">
                    <strong>Results Not Showing:</strong> Results are available 30 minutes after the election ends. Please check back later.
                  </div>
                  <div className="list-group-item">
                    <strong>Technical Errors:</strong> Refresh the page or try logging out and back in. Clear your browser cache if problems persist.
                  </div>
                </div>
              </div>

              <div className="alert alert-warning alert-custom mt-4">
                <h6>⚠️ Important Notice</h6>
                <p className="mb-0">
                  For security reasons, never share your login credentials with anyone. 
                  The election administrators will never ask for your password.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
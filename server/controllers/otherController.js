export const getRoot = (req, res) => {
    res.send('Welcome to EduHub LMS Backend API');
};

export const getAbout = (req, res) => {
    res.send("About Page");
};

export const getContact = (req, res) => {
    res.send("Contact Page");
};

export const getPrivacy = (req, res) => {
    res.send("Privacy Policy Page");
};

export const getTerms = (req, res) => {
    res.send("Terms and Conditions Page");
};
// Add more general routes as needed, such as for FAQs, support, etc.
import httpRequest from "./utils/httpRequest.js";

// Auth Modal Functionality
document.addEventListener("DOMContentLoaded", function () {
    // Get DOM elements
    const signupBtn = document.querySelector(".signup-btn");
    const loginBtn = document.querySelector(".login-btn");
    const authModal = document.getElementById("authModal");
    const modalClose = document.getElementById("modalClose");
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");
    const showLoginBtn = document.getElementById("showLogin");
    const showSignupBtn = document.getElementById("showSignup");

    // Function to show signup form
    function showSignupForm() {
        signupForm.style.display = "block";
        loginForm.style.display = "none";
    }

    // Function to show login form
    function showLoginForm() {
        signupForm.style.display = "none";
        loginForm.style.display = "block";
    }

    // Function to open modal
    function openModal() {
        authModal.classList.add("show");
        document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    // Open modal with Sign Up form when clicking Sign Up button
    signupBtn.addEventListener("click", function () {
        showSignupForm();
        openModal();
    });

    // Open modal with Login form when clicking Login button
    loginBtn.addEventListener("click", function () {
        showLoginForm();
        openModal();
    });

    // Close modal function
    function closeModal() {
        authModal.classList.remove("show");
        document.body.style.overflow = "auto"; // Restore scrolling
    }

    // Close modal when clicking close button
    modalClose.addEventListener("click", closeModal);

    // Close modal when clicking overlay (outside modal container)
    authModal.addEventListener("click", function (e) {
        if (e.target === authModal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && authModal.classList.contains("show")) {
            closeModal();
        }
    });

    // Switch to Login form
    showLoginBtn.addEventListener("click", function () {
        showLoginForm();
    });

    // Switch to Signup form
    showSignupBtn.addEventListener("click", function () {
        showSignupForm();
    });
    function showSignupError(inputId, message) {
        const input = document.querySelector(inputId);
        const formGroup = input.closest(".form-group");
        const errorMessage = formGroup.querySelector(".error-message span");

        formGroup.classList.add("invalid");
        errorMessage.textContent = message;
    }
    function validateSignupForm(email, password) {
        const emailGroup = document
            .querySelector("#signupEmail")
            .closest(".form-group");

        const passwordGroup = document
            .querySelector("#signupPassword")
            .closest(".form-group");

        let isValid = true;

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            emailGroup.classList.add("invalid");
            isValid = false;
        } else {
            emailGroup.classList.remove("invalid");
        }

        // Validate password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,128}$/;

        if (!passwordRegex.test(password)) {
            passwordGroup.classList.add("invalid");
            isValid = false;
        } else {
            passwordGroup.classList.remove("invalid");
        }

        return isValid;
    }

    signupForm
        .querySelector(".auth-form-content")
        .addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.querySelector("#signupEmail").value;
            const password = document.querySelector("#signupPassword").value;
            // Kiểm tra frontend
            if (!validateSignupForm(email, password)) {
                return;
            }
            const credentials = {
                email,
                password,
            };

            try {
                const { user, access_token, refresh_token } =
                    await httpRequest.post("auth/register", credentials);

                // Lưu thông tin đăng nhập
                localStorage.setItem("accessToken", access_token);
                localStorage.setItem("refreshToken", refresh_token);
                localStorage.setItem("currentUser", JSON.stringify(user));

                // Cập nhật giao diện
                updateCurrentUser(user);

                // Đóng modal
                closeModal();
            } catch (error) {
                const code = error?.response?.error?.code;

                if (code === "EMAIL_EXISTS") {
                    showSignupError("#signupEmail", "Email đã được đăng ký");
                } else if (code === "VALIDATION_ERROR") {
                    const details = error.response.error.details;

                    details.forEach((detail) => {
                        if (detail.field === "email") {
                            showSignupError("#signupEmail", detail.message);
                        }

                        if (detail.field === "password") {
                            showSignupError("#signupPassword", detail.message);
                        }
                    });
                } else {
                    console.log(error);
                }
            }
        });
    loginForm
        .querySelector(".auth-form-content")
        .addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.querySelector("#loginEmail").value.trim();
            const password = document.querySelector("#loginPassword").value;

            const credentials = {
                email,
                password,
            };

            try {
                const { user, access_token, refresh_token } =
                    await httpRequest.post("auth/login", credentials);

                // Lưu token
                localStorage.setItem("accessToken", access_token);
                localStorage.setItem("refreshToken", refresh_token);
                localStorage.setItem("currentUser", JSON.stringify(user));

                // Cập nhật giao diện
                updateCurrentUser(user);

                // Đóng modal
                closeModal();
            } catch (error) {
                console.log(error);
            }
        });
});

// User Menu Dropdown Functionality
document.addEventListener("DOMContentLoaded", function () {
    const userAvatar = document.getElementById("user-avatar");
    const userDropdown = document.getElementById("userDropdown");
    const logoutBtn = document.getElementById("logoutBtn");

    // Toggle dropdown when clicking avatar
    userAvatar.addEventListener("click", function (e) {
        e.stopPropagation();
        userDropdown.classList.toggle("show");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function (e) {
        if (
            !userAvatar.contains(e.target) &&
            !userDropdown.contains(e.target)
        ) {
            userDropdown.classList.remove("show");
        }
    });

    // Close dropdown when pressing Escape
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && userDropdown.classList.contains("show")) {
            userDropdown.classList.remove("show");
        }
    });

    // Handle logout button click
    logoutBtn.addEventListener("click", async function () {
        // Close dropdown first
        userDropdown.classList.remove("show");
        const authButtons = document.querySelector(".auth-buttons");
        const userInfo = document.querySelector(".user-info");

        try {
            await httpRequest.post("auth/logout");

            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("currentUser");
            authButtons.classList.add("show");
            userInfo.classList.remove("show");

        } catch (error) {
            console.log(error);
        }
    });
});

// Other functionality
document.addEventListener("DOMContentLoaded", async () => {
    // TODO: Implement other functionality here
    const authButtons = document.querySelector(".auth-buttons");
    const userInfo = document.querySelector(".user-info");
    try {
        const { user } = await httpRequest.get("auth/users/me");
        updateCurrentUser(user);
        userInfo.classList.add("show");
        // authButtons.style.display = "none";
    } catch (error) {
        authButtons.classList.add("show");
    }
});

function updateCurrentUser(user) {
    const userName = document.querySelector("#user-name");
    const userAvatar = document.querySelector("#user-avatar");
    if (user.avatar_url) {
        userAvatar.src = user.avatar_url;
    }
    if (user.email) {
        userName.textContent = user.email;
    }
}

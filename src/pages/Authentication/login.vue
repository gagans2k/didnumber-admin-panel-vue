<template>
  <div class="login-container">
    <v-container fluid fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="loginForm" v-model="isFormValid">
                <v-text-field
                  v-model="emailAddress"
                  label="Email"
                  name="email"
                  prepend-icon="mdi-email"
                  type="email"
                  :rules="emailRules"
                  required
                />
                <v-text-field
                  v-model="password"
                  label="Password"
                  name="password"
                  prepend-icon="mdi-lock"
                  type="password"
                  :rules="passwordRules"
                  required
                />
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="primary"
                :loading="isLoading"
                :disabled="!isFormValid"
                @click="login"
              >
                Login
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Error Dialog -->
    <v-dialog v-model="showErrorTwoFactordDalog" max-width="400">
      <v-card>
        <v-card-title>Error</v-card-title>
        <v-card-text>{{ printErrorMessage }}</v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="showErrorTwoFactordDalog = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Message Snackbar -->
    <v-snackbar
      v-model="showMessageSnackbar"
      :color="messageColor"
      timeout="3000"
    >
      {{ showMessage }}
    </v-snackbar>
  </div>
</template>

<script>
import authAPI from "@/services/authAPI";
import { inject, ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "UserLogin",

  setup() {
    const router = useRouter();
    const eventBus = inject("eventBus");

    // Form data
    const emailAddress = ref("");
    const password = ref("");
    const isLoading = ref(false);
    const isFormValid = ref(false);
    const showErrorTwoFactordDalog = ref(false);
    const printErrorMessage = ref("");
    const showMessageSnackbar = ref(false);
    const showMessage = ref("");
    const messageColor = ref("error");

    // Form validation rules
    const emailRules = [
      (v) => !!v || "Email is required",
      (v) => /.+@.+\..+/.test(v) || "Email must be valid",
    ];

    const passwordRules = [
      (v) => !!v || "Password is required",
      (v) => v.length >= 6 || "Password must be at least 6 characters",
    ];

    const login = async () => {
      if (!isFormValid.value) return;

      isLoading.value = true;

      try {
        const loginPayload = {
          username: emailAddress.value,
          password: password.value,
          geoLocation: "IN", // Default location
        };

        const response = await authAPI.login(loginPayload);

        if (response.partyDetail && response.partyDetail.isAuthenticated) {
          // Store authentication data
          localStorage.setItem(
            "authToken",
            `Basic ${btoa(emailAddress.value + ":" + password.value)}`
          );
          localStorage.setItem(
            "userDetail",
            JSON.stringify(response.partyDetail)
          );
          localStorage.setItem(
            "auth",
            btoa(emailAddress.value + ":" + password.value)
          );
          localStorage.setItem("authNew", response.partyDetail.authToken);

          // Show success message
          if (eventBus) {
            eventBus.emit("SHOW_SNACKBAR", {
              text: "You are successfully logged in",
              color: "success",
            });
          }

          // Redirect to dashboard
          router.push("/dashboard");
        } else {
          showMessage.value = "Invalid credentials";
          showMessageSnackbar.value = true;
          messageColor.value = "error";
        }
      } catch (error) {
        console.error("Login error:", error);
        showMessage.value =
          error.data?.messageDetail || "Login failed. Please try again.";
        showMessageSnackbar.value = true;
        messageColor.value = "error";
      } finally {
        isLoading.value = false;
      }
    };

    const verifySecurityGoogleAuthenticator = async (verificationCode) => {
      if (!verificationCode || verificationCode.trim() === "") {
        if (eventBus) {
          eventBus.emit("SHOW_SNACKBAR", {
            text: "Verification code cannot be empty.",
            color: "error",
          });
        }
        return;
      }

      isLoading.value = true;

      try {
        const userLoginId = localStorage.getItem("nameOfUser");
        const password = localStorage.getItem("passwordOfUser");
        const geoLocation = localStorage.getItem("countryCode") || "IN";

        const verificationPayload = {
          verificationCode,
          password: window.atob(password),
          geoLocation,
          username: window.atob(userLoginId),
        };

        const response =
          await authAPI.verifySecurityGoogleAuthenticator(verificationPayload);

        if (
          response.partyDetail &&
          response.partyDetail.isAuthenticated &&
          response.partyDetail.role === "ADMIN"
        ) {
          localStorage.setItem(
            "authToken",
            `Basic ${btoa(window.atob(userLoginId) + ":" + window.atob(password))}`
          );
          localStorage.setItem(
            "userDetail",
            JSON.stringify(response.partyDetail)
          );
          localStorage.setItem(
            "auth",
            btoa(window.atob(userLoginId) + ":" + window.atob(password))
          );
          localStorage.setItem("authNew", response.partyDetail.authToken);

          if (eventBus) {
            eventBus.emit("SHOW_SNACKBAR", {
              text: "You are successfully logged in",
              color: "success",
            });
          }

          router.push("/dashboard");
        } else {
          showMessage.value = "You cannot login to this application!";
          showMessageSnackbar.value = true;
        }
      } catch (error) {
        console.error("Verification error:", error);
        const errorMessage =
          error.data?.messageDetail ||
          "Failed to verify the code. Please try again.";
        printErrorMessage.value = errorMessage;
        showErrorTwoFactordDalog.value = true;
      } finally {
        isLoading.value = false;
      }
    };

    return {
      emailAddress,
      password,
      isLoading,
      isFormValid,
      showErrorTwoFactordDalog,
      printErrorMessage,
      showMessageSnackbar,
      showMessage,
      messageColor,
      emailRules,
      passwordRules,
      login,
      verifySecurityGoogleAuthenticator,
    };
  },
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>

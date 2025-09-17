// src/composables/useAuthValidation.ts
import { ref, computed } from 'vue';
import type { Ref } from 'vue';

// Définir une interface pour la structure générique d'un formulaire d'authentification
// Les propriétés sont optionnelles car tous les formulaires n'auront pas tous les champs.
interface AuthForm {
  username?: string;
  email?: string; // Rendu optionnel pour flexibilité (ex: formulaire de login sans email de confirmation)
  confirmEmail?: string;
  password?: string;
  confirmPassword?: string;
  currentPassword?: string; // Ajouté pour le changement de mot de passe
  newPassword?: string; // Ajouté pour le changement de mot de passe
  confirmNewPassword?: string; // Ajouté pour la confirmation du nouveau mot de passe
}

// Interface pour les erreurs de validation
interface ValidationErrors {
  username?: string;
  email?: string;
  confirmEmail?: string;
  password?: string;
  confirmPassword?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmNewPassword?: string;
}

/**
 * Composable pour gérer la validation des formulaires d'authentification.
 * Il peut être utilisé pour l'inscription, la connexion, la mise à jour de profil, le changement de mot de passe.
 * @param form Le ref de l'objet du formulaire à valider.
 * @returns Un objet contenant les erreurs de validation, les fonctions de validation individuelles,
 * une fonction pour valider tous les champs, et un computed pour la validité globale.
 */
export function useAuthValidation(form: Ref<AuthForm>) {
  const validationErrors: Ref<ValidationErrors> = ref({});

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/;

  // Valide le nom d'utilisateur
  const validateUsername = () => {
    if ('username' in form.value) { // Vérifie si le champ existe dans le formulaire
      if (!form.value.username) {
        validationErrors.value.username = 'Le pseudo est requis.';
      } else if (form.value.username.length < 3 || form.value.username.length > 64) {
        validationErrors.value.username = 'Le pseudo doit contenir entre 3 et 64 caractères.';
      } else {
        validationErrors.value.username = '';
      }
    }
  };

  // Valide l'email
  const validateEmail = () => {
    if ('email' in form.value) {
      if (!form.value.email) {
        validationErrors.value.email = "L'email est requis.";
      } else if (!emailRegex.test(form.value.email)) {
        validationErrors.value.email = "Le format de l'email est invalide.";
      } else if (form.value.email.length > 64) {
        validationErrors.value.email = "L'email ne doit pas dépasser 64 caractères.";
      } else {
        validationErrors.value.email = '';
      }
      if ('confirmEmail' in form.value) {
        validateConfirmEmail();
      }
    }
  };

  // Valide la confirmation d'email
  const validateConfirmEmail = () => {
    if ('confirmEmail' in form.value) {
      if (!form.value.confirmEmail) {
        validationErrors.value.confirmEmail = "La confirmation d'email est requise.";
      } else if (!emailRegex.test(form.value.confirmEmail)) {
        validationErrors.value.confirmEmail = "Le format de l'email de confirmation est invalide.";
      } else if (form.value.confirmEmail !== form.value.email) {
        validationErrors.value.confirmEmail = 'Les adresses email ne correspondent pas.';
      } else {
        validationErrors.value.confirmEmail = '';
      }
    }
  };

  // Valide le mot de passe (nouveau mot de passe pour changement, ou mot de passe d'inscription)
  const validatePassword = () => {
    const passwordFieldName = 'newPassword' in form.value ? 'newPassword' : 'password';
    const passwordValue = form.value[passwordFieldName];

    if (!passwordValue) {
      validationErrors.value[passwordFieldName] = 'Le mot de passe est requis.';
    } else if (passwordValue.length < 8 || passwordValue.length > 256) {
      validationErrors.value[passwordFieldName] = 'Le mot de passe doit contenir entre 8 et 256 caractères.';
    } else if (!passwordRegex.test(passwordValue)) {
      validationErrors.value[passwordFieldName] = 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un caractère spécial (!@#$%^&*).';
    } else {
      validationErrors.value[passwordFieldName] = '';
    }
    if ('confirmPassword' in form.value || 'confirmNewPassword' in form.value) {
      validateConfirmPassword();
    }
  };

  // Valide la confirmation du mot de passe
  const validateConfirmPassword = () => {
    const confirmPasswordFieldName = 'confirmNewPassword' in form.value ? 'confirmNewPassword' : 'confirmPassword';
    const passwordFieldName = 'newPassword' in form.value ? 'newPassword' : 'password';

    if (!form.value[confirmPasswordFieldName]) {
      validationErrors.value[confirmPasswordFieldName] = 'La confirmation du mot de passe est requise.';
    } else if (form.value[confirmPasswordFieldName] !== form.value[passwordFieldName]) {
      validationErrors.value[confirmPasswordFieldName] = 'Les mots de passe ne correspondent pas.';
    } else {
      validationErrors.value[confirmPasswordFieldName] = '';
    }
  };

  // Valide le mot de passe actuel (spécifique au changement de mot de passe)
  const validateCurrentPassword = () => {
    if ('currentPassword' in form.value) {
      if (!form.value.currentPassword) {
        validationErrors.value.currentPassword = 'Le mot de passe actuel est requis.';
      } else {
        validationErrors.value.currentPassword = '';
      }
    }
  };

  // Fonction pour valider tous les champs pertinents du formulaire passé
  const validateAllFields = () => {
    // Utilise 'in form.value' pour valider uniquement les champs qui existent dans l'objet form
    if ('username' in form.value) validateUsername();
    if ('email' in form.value) validateEmail();
    if ('confirmEmail' in form.value) validateConfirmEmail();
    if ('password' in form.value || 'newPassword' in form.value) validatePassword();
    if ('confirmPassword' in form.value || 'confirmNewPassword' in form.value) validateConfirmPassword();
    if ('currentPassword' in form.value) validateCurrentPassword();
  };

  // Vérifie si le formulaire est globalement valide
  const isFormValid = computed(() => {
    return Object.values(validationErrors.value).every(error => error === '');
  });

  return {
    validationErrors,
    validateUsername,
    validateEmail,
    validateConfirmEmail,
    validatePassword,
    validateConfirmPassword,
    validateCurrentPassword, // Exposer cette fonction aussi
    validateAllFields,
    isFormValid,
  };
}

import { supabase } from '../lib/supabaseClient';

/**
 * ฟังก์ชันสำหรับลงทะเบียนผู้ใช้ใหม่
 * @param {string} email - อีเมล
 * @param {string} password - รหัสผ่าน
 * @param {object} metadata - ข้อมูลเพิ่มเติม (เช่น ชื่อ, นามสกุล)
 * @returns {Promise<{user: any, error: any}>}
 */
export async function signUp(email, password, metadata = {}) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });

        if (error) throw error;

        return { user: data.user, error: null };
    } catch (error) {
        console.error('Error signing up:', error);
        return { user: null, error };
    }
}

/**
 * ฟังก์ชันสำหรับเข้าสู่ระบบ
 * @param {string} email - อีเมล
 * @param {string} password - รหัสผ่าน
 * @returns {Promise<{user: any, session: any, error: any}>}
 */
export async function signIn(email, password) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;

        return { user: data.user, session: data.session, error: null };
    } catch (error) {
        console.error('Error signing in:', error);
        return { user: null, session: null, error };
    }
}

/**
 * ฟังก์ชันสำหรับออกจากระบบ
 * @returns {Promise<{error: any}>}
 */
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();

        if (error) throw error;

        return { error: null };
    } catch (error) {
        console.error('Error signing out:', error);
        return { error };
    }
}

/**
 * ฟังก์ชันสำหรับดึงข้อมูลผู้ใช้ปัจจุบัน
 * @returns {Promise<{user: any, error: any}>}
 */
export async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error) throw error;

        return { user, error: null };
    } catch (error) {
        console.error('Error getting current user:', error);
        return { user: null, error };
    }
}

/**
 * ฟังก์ชันสำหรับดึง session ปัจจุบัน
 * @returns {Promise<{session: any, error: any}>}
 */
export async function getSession() {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) throw error;

        return { session, error: null };
    } catch (error) {
        console.error('Error getting session:', error);
        return { session: null, error };
    }
}

/**
 * ฟังก์ชันสำหรับรีเซ็ตรหัสผ่าน
 * @param {string} email - อีเมล
 * @returns {Promise<{error: any}>}
 */
export async function resetPassword(email) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`
        });

        if (error) throw error;

        return { error: null };
    } catch (error) {
        console.error('Error resetting password:', error);
        return { error };
    }
}

/**
 * ฟังก์ชันสำหรับอัพเดทรหัสผ่าน
 * @param {string} newPassword - รหัสผ่านใหม่
 * @returns {Promise<{user: any, error: any}>}
 */
export async function updatePassword(newPassword) {
    try {
        const { data, error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) throw error;

        return { user: data.user, error: null };
    } catch (error) {
        console.error('Error updating password:', error);
        return { user: null, error };
    }
}

/**
 * ฟังก์ชันสำหรับติดตาม auth state changes
 * @param {function} callback - ฟังก์ชันที่จะถูกเรียกเมื่อมีการเปลี่ยนแปลง auth state
 * @returns {object} - Subscription object
 */
export function onAuthStateChange(callback) {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });

    return subscription;
}

/**
 * ฟังก์ชันสำหรับเข้าสู่ระบบด้วย OAuth (Google, GitHub, etc.)
 * @param {string} provider - ชื่อ provider (google, github, facebook, etc.)
 * @returns {Promise<{error: any}>}
 */
export async function signInWithOAuth(provider) {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: provider,
            options: {
                redirectTo: window.location.origin
            }
        });

        if (error) throw error;

        return { error: null };
    } catch (error) {
        console.error(`Error signing in with ${provider}:`, error);
        return { error };
    }
}

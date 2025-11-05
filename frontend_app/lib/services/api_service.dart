import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import '../utils/constants.dart';

class ApiService {
  static Future<Map<String, dynamic>?> login(String email, String password) async {
    final url = Uri.parse("$BASE_URL/auth/login");
    try {
      final response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: jsonEncode({"email": email, "password": password}),
      );

      if (response.statusCode == 200) {

        final data = jsonDecode(response.body);

        // Save token to local storage
        final prefs = await SharedPreferences.getInstance();
        await prefs.setString("token", data["token"]);

        return data;
      } else {
        print("Login failed: ${response.body}");
        return null;
      }
    } catch (e) {
      print("Error during login: $e");
      return null;
    }
  }

  static Future<Map<String, dynamic>?> getUserProfile() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");

    if (token == null) return null;

    final url = Uri.parse("$BASE_URL/user/me");
    try {
      final response = await http.get(
        url,
        headers: {"Authorization": "Bearer $token"},
      );

      if (response.statusCode == 200) {
                print("Profile response: ${response.body}");
        return jsonDecode(response.body);
      } else {
        print("Profile fetch failed: ${response.body}");
        return null;
      }
    } catch (e) {
      print("Error fetching profile: $e");
      return null;
    }
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove("token");
  }

static Future<Map<String, dynamic>?> register(String username, String email, String password) async {
  final url = Uri.parse("$BASE_URL/auth/register");
  try {
    print("➡️ Sending register request: $username, $email");
    final response = await http.post(
      url,
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "username": username,
        "email": email,
        "password": password,
      }),
    );

    print("⬅️ Register response: ${response.statusCode}");
    print("⬅️ Register body: ${response.body}");

    if (response.statusCode == 201) {
      final data = jsonDecode(response.body);
      print("✅ Registration success: $data");
      return data;
    } else {
      print("❌ Registration failed: ${response.body}");
      return null;
    }
  } catch (e) {
    print("💥 Error during registration: $e");
    return null;
  }
}


static Future<Map<String, dynamic>?> completeProfile({
  required String dob,
  required String gender,
  required String stream,
  required String phone,
  required String course,
  required String year,
  required String semester,
}) async {
  final prefs = await SharedPreferences.getInstance();
  final token = prefs.getString("token");

  if (token == null) return null;

  final url = Uri.parse("$BASE_URL/user/complete-profile");
  try {
    final response = await http.put(
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer $token",
      },
      body: jsonEncode({
        "dob": dob,
        "gender": gender,
        "stream": stream,
        "phone": phone,
        "course": course,
        "year": year,
        "semester": semester,
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      print("Profile completion success: $data");

      // Optionally re-save the new token or user data if returned
      if (data["token"] != null) {
        await prefs.setString("token", data["token"]);
      }

      return data;
    } else {
      print("Profile completion failed: ${response.body}");
      return null;
    }
  } catch (e) {
    print("Error completing profile: $e");
    return null;
  }
}



}

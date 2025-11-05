// lib/pages/profile_completion_page.dart
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'member_page.dart';

class ProfileCompletionPage extends StatefulWidget {
  const ProfileCompletionPage({super.key});
  

  @override
  State<ProfileCompletionPage> createState() => _ProfileCompletionPageState();
}

class _ProfileCompletionPageState extends State<ProfileCompletionPage> {
  final TextEditingController _phoneController = TextEditingController(text: "+91 ");
  final TextEditingController _dobController = TextEditingController();
  String gender = "";
  String stream = "";
  String course = "";
  String year = "";
  String semester = "";

  bool _isLoading = false;

  final Map<String, List<String>> semestersByYear = {
    "1st": ["1", "2"],
    "2nd": ["3", "4"],
    "3rd": ["5", "6"],
    "4th": ["7", "8"],
  };

  Future<void> completeProfile() async {
    setState(() => _isLoading = true);
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString("token");

    final url = Uri.parse('https://club-connect-p2o2.onrender.com/api/user/complete-profile');

    try {
      final response = await http.put(
        url,
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer $token",
        },
        body: jsonEncode({
          "dob": _dobController.text,
          "gender": gender,
          "stream": stream,
          "phone": _phoneController.text,
          "course": course,
          "year": year,
          "semester": semester,
        }),
      );

      final data = jsonDecode(response.body);
      if (response.statusCode == 200) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Profile completed successfully!")),
        );
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const MemberPage()),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(data['msg'] ?? 'Error completing profile')),
        );
      }
    } catch (e) {
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      setState(() => _isLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.black,
      appBar: AppBar(
        backgroundColor: Colors.blueGrey[900],
        title: const Text("Complete Profile"),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: SingleChildScrollView(
          child: Column(
            children: [
              TextField(
                controller: _dobController,
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: "Date of Birth (YYYY-MM-DD)",
                  labelStyle: TextStyle(color: Colors.grey),
                  enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.blueAccent)),
                ),
              ),
              const SizedBox(height: 15),
              DropdownButtonFormField<String>(
                dropdownColor: Colors.black,
                decoration: const InputDecoration(
                  labelText: "Gender",
                  labelStyle: TextStyle(color: Colors.grey),
                  enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.blueAccent)),
                ),
                value: gender.isEmpty ? null : gender,
                items: const [
                  DropdownMenuItem(value: "male", child: Text("Male")),
                  DropdownMenuItem(value: "female", child: Text("Female")),
                  DropdownMenuItem(value: "non-binary", child: Text("Non-binary")),
                  DropdownMenuItem(value: "other", child: Text("Other")),
                ],
                onChanged: (val) => setState(() => gender = val!),
              ),
              const SizedBox(height: 15),
              DropdownButtonFormField<String>(
                dropdownColor: Colors.black,
                decoration: const InputDecoration(
                  labelText: "Stream",
                  labelStyle: TextStyle(color: Colors.grey),
                  enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.blueAccent)),
                ),
                value: stream.isEmpty ? null : stream,
                items: const [
                  DropdownMenuItem(value: "CSE", child: Text("CSE")),
                  DropdownMenuItem(value: "ECE", child: Text("ECE")),
                  DropdownMenuItem(value: "Mech", child: Text("Mechanical")),
                  DropdownMenuItem(value: "Civil", child: Text("Civil")),
                  DropdownMenuItem(value: "Electrical", child: Text("Electrical")),
                ],
                onChanged: (val) => setState(() => stream = val!),
              ),
              const SizedBox(height: 15),
              DropdownButtonFormField<String>(
                dropdownColor: Colors.black,
                decoration: const InputDecoration(
                  labelText: "Course",
                  labelStyle: TextStyle(color: Colors.grey),
                  enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.blueAccent)),
                ),
                value: course.isEmpty ? null : course,
                items: const [
                  DropdownMenuItem(value: "BTech", child: Text("B.Tech")),
                  DropdownMenuItem(value: "MTech", child: Text("M.Tech")),
                  DropdownMenuItem(value: "BCA", child: Text("BCA")),
                  DropdownMenuItem(value: "MCA", child: Text("MCA")),
                  DropdownMenuItem(value: "Diploma", child: Text("Diploma")),
                ],
                onChanged: (val) => setState(() => course = val!),
              ),
              const SizedBox(height: 15),
              DropdownButtonFormField<String>(
                dropdownColor: Colors.black,
                decoration: const InputDecoration(
                  labelText: "Year",
                  labelStyle: TextStyle(color: Colors.grey),
                  enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.blueAccent)),
                ),
                value: year.isEmpty ? null : year,
                items: const [
                  DropdownMenuItem(value: "1st", child: Text("1st Year")),
                  DropdownMenuItem(value: "2nd", child: Text("2nd Year")),
                  DropdownMenuItem(value: "3rd", child: Text("3rd Year")),
                  DropdownMenuItem(value: "4th", child: Text("4th Year")),
                ],
                onChanged: (val) => setState(() => year = val!),
              ),
              const SizedBox(height: 15),
              if (year.isNotEmpty)
                DropdownButtonFormField<String>(
                  dropdownColor: Colors.black,
                  decoration: const InputDecoration(
                    labelText: "Semester",
                    labelStyle: TextStyle(color: Colors.grey),
                    enabledBorder: OutlineInputBorder(borderSide: BorderSide(color: Colors.blueAccent)),
                  ),
                  value: semester.isEmpty ? null : semester,
                  items: semestersByYear[year]!
                      .map((sem) => DropdownMenuItem(value: sem, child: Text(sem)))
                      .toList(),
                  onChanged: (val) => setState(() => semester = val!),
                ),
              const SizedBox(height: 25),
              ElevatedButton(
                onPressed: _isLoading ? null : completeProfile,
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blueAccent,
                  minimumSize: const Size(double.infinity, 48),
                ),
                child: _isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text("Save & Continue"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

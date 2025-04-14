import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Prim "mo:⛔";

actor backend {
  public type Donor = {
    name: Text;
    bloodGroup: Text;
    age: Nat;
    phone: Text;
    medicalHistory: Text;
  };

  var donors: [Donor] = [];

  // Add new donor
  public func addDonor(
    name: Text,
    bloodGroup: Text,
    age: Nat,
    phone: Text,
    medicalHistory: Text
  ) : async () {
    let newDonor: Donor = {
      name = name;
      bloodGroup = bloodGroup;
      age = age;
      phone = phone;
      medicalHistory = medicalHistory;
    };
    donors := Array.append(donors, [newDonor]);
  };

  // Get all donors
  public query func getAllDonors() : async [Donor] {
    donors
  };

  // Search donors with case-insensitive matching
  public query func searchDonorsByText(text: Text) : async [Donor] {
    let lowerSearch = Text.map(text, Prim.charToLower);
    
    Array.filter<Donor>(
      donors,
      func(d: Donor) : Bool {
        let lowerName = Text.map(d.name, Prim.charToLower);
        let lowerPhone = Text.map(d.phone, Prim.charToLower);
        
        Text.contains(lowerName, #text lowerSearch) or
        Text.contains(lowerPhone, #text lowerSearch)
      }
    )
  };
};

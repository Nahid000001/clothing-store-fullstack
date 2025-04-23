#!/usr/bin/env python
"""
Script to generate valid MongoDB ObjectIDs for testing the clothing store application.
This helps users test the application with valid IDs when no real data exists.
"""

import uuid
import hashlib
import time

def generate_valid_object_id():
    """Generate a valid MongoDB ObjectID format string."""
    # MongoDB ObjectID is a 12-byte value with:
    # - 4 bytes: timestamp
    # - 3 bytes: machine id
    # - 2 bytes: process id
    # - 3 bytes: counter
    
    # For our test purposes, we'll create something that's the right format
    # Get current timestamp as 4 bytes
    timestamp = int(time.time()).to_bytes(4, byteorder='big')
    
    # Use a hash of a UUID as the remaining 8 bytes
    uuid_hash = hashlib.md5(uuid.uuid4().bytes).digest()[:8]
    
    # Combine them
    object_id_bytes = timestamp + uuid_hash
    
    # Convert to hex string
    return object_id_bytes.hex()

if __name__ == "__main__":
    print("\nClothing Store Application: Valid ObjectID Generator")
    print("==================================================")
    print("\nUse one of these valid MongoDB ObjectIDs to test your application:")
    print("\nValid Store IDs:")
    for i in range(5):
        print(f"  {i+1}. {generate_valid_object_id()}")
    
    print("\nUsage:")
    print("  1. Copy one of these IDs")
    print("  2. Access your application at: http://localhost:4200/stores/[PASTE_ID_HERE]")
    print("\nNote: These IDs are properly formatted but won't match real data unless it's added to your database.\n") 
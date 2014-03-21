
fn main() {
    let mut fact = 1;
    let mut n = 1;
    
    loop {
        fact = fact * n;
        println!(fact);
        n = n + 1;
        
        if (n > 10) {
            break;
        }
    }
}


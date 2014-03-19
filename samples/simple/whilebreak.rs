
fn main() {
    let fact = 1;
    let n = 1;
    
    while true {
        fact = fact * n;
        println!(fact);
        n = n + 1;
        
        if n > 10 {
            break;
        }
    }
}


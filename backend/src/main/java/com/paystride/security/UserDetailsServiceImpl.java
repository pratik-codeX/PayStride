package com.paystride.security;

import com.paystride.repository.UserRepository;
import com.paystride.repository.WorkerRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;
    private final WorkerRepository workerRepository;

    public UserDetailsServiceImpl(UserRepository userRepository,
                                   WorkerRepository workerRepository) {
        this.userRepository = userRepository;
        this.workerRepository = workerRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        // Try loading as admin/supervisor user first
        var userOpt = userRepository.findByEmail(username);
        if (userOpt.isPresent()) {
            return userOpt.get();
        }

        // Try loading as worker (username = workerCode)
        var workerOpt = workerRepository.findByWorkerCode(username);
        if (workerOpt.isPresent()) {
            var worker = workerOpt.get();
            return new User(
                worker.getWorkerCode(),
                worker.getPassword() != null ? worker.getPassword() : "",
                Collections.singletonList(
                    new SimpleGrantedAuthority("ROLE_WORKER"))
            );
        }

        throw new UsernameNotFoundException("User not found: " + username);
    }
}
